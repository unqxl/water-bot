import {
  ColorResolvable,
  CommandInteraction,
  DiscordAPIError,
  Guild,
  HTTPError,
  Message,
  MessageEmbed,
  MessageOptions,
  Snowflake,
  TextChannel,
  User,
} from "discord.js";
import { codeBlock } from "@discordjs/builders";
import Goose from "./Goose";
import fetch from "node-fetch";

export = class Functions {
  public client: Goose;

  constructor(client: Goose) {
    this.client = client;
  }

  buildEmbed(
    message: Message | CommandInteraction | { author: User | null },
    color: ColorResolvable,
    description: string,
    emoji?: string | boolean,
    author?: boolean
  ): MessageEmbed {
    const embed = new MessageEmbed();

    if (author) {
      if(message instanceof Message) embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
      else if(message instanceof CommandInteraction) embed.setAuthor(message.user.username, message.user.displayAvatarURL({ dynamic: true }));
      else embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
    }

    embed.setColor(color);
    embed.setDescription(
      `${emoji !== false ? `${emoji} | ` : ""}${description}`
    );

    return embed;
  }

  checkOwner(target: User): boolean {
    return this.client.owners.includes(target.id);
  }

  checkBotMention(message: Message): boolean {
    return message.mentions.has(message.guild.me, {
      ignoreEveryone: true,
      ignoreRoles: true,
    });
  }

  async updateToken(): Promise<boolean> {
    const id = this.client.config.twitch.client_id;
    const secret = this.client.config.twitch.client_secret;

    const data = await (await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`,
      {
        method: "POST",
      }
    )).json();

    this.client.twitchKey = data['access_token'];

    return true;
  }

  formatNumber(n: number | string) {
    return Number.parseFloat(String(n)).toLocaleString('be-BE');
  }

  async trimArray(
    arr: any[],
    length = 10,
    lang: typeof import('@locales/English').default,
  ) {
    if (arr.length > length) {
      const len = (arr.length - length).toString();
      const more = lang.FUNCTIONS.TRIMARRAY.replace('{len}', len);

      arr = arr.slice(0, length);
      arr.push(more);
    }

    return arr;
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  checkGuildBirthday(guild: Guild): Birthday {
    const createDate = guild.createdTimestamp;
    const date = new Date(createDate);
    const toYear = new Date(createDate);
    const currentDate = new Date();

    date.setFullYear(new Date().getFullYear() + 1);

    if (date.getTime() !== currentDate.getTime()) {
      return {
        status: false,
      };
    } else {
      const createdYear = toYear.getFullYear();
      const yearNow = currentDate.getFullYear();
      const diff = Math.floor(yearNow - createdYear);

      return {
        status: true,
        years: diff,
      };
    }
  }

  async getLanguageFile(guild: Guild): Promise<typeof import('../locales/English').default> {
    const language = this.client.database.getSetting(guild, 'language');

    return import(`../locales/${language === 'en-US' ? 'English' : 'Russian'}`).then((f) => f.default);
  }

  sp(num: string | number) {
    const number = Number(num);

    return number.toLocaleString('be');
  }

  async promptMessage(message: Message, data: MessageOptions, time = 15000): Promise<string | boolean> {
    const msg = await message.channel.send(data);
    const filter = (m: Message) => m.author.id === message.author.id;
    const collector = await msg.channel.awaitMessages({
      filter,
      max: 1,
      time
    });

    const collected = collector.first();
    if(!collected) {
      msg.delete();
      return false;
    }
    else {
      return collected.content;
    };
  }

  async sendLog(err: unknown, type: WarningTypes) {
    const error = err as DiscordAPIError | HTTPError | Error;

    try {
      if(error.message?.includes("Missing Access")) return; 
      if(error.message?.includes("Unknown Message")) return;

      const channelID = this.client.config.bot.logsChannelID as Snowflake | undefined;
      if(!channelID) return;

      const channel = (this.client.channels.cache.get(channelID) || (await this.client.channels.fetch(channelID))) as TextChannel;
      if(!channel) return;

      const message = {
        author: this.client.user
      };

      const code = "code" in error ? error.code : "N/A";
      const httpStatus = "httpStatus" in error ? error.httpStatus : "N/A";
      const requestData = "requestData" in error ? error.requestData : { json: {} };
      const name = error.name || "N/A";

      var stack = error.stack || error;
      var jsonString: string | undefined = "";

      try {
        jsonString = JSON.stringify(requestData.json, null, 2);
      } 
      catch (error) {
        jsonString = "";
      };

      if(jsonString.length >= 2048) {
        jsonString = jsonString ? `${jsonString?.substring(0, 2045)}...` : "";
      };

      if(typeof stack === "string" && stack.length >= 2048) {
        console.warn(stack);
        stack = "Произошла ошибка, но она большая для того, чтобы отправить её сюда.\nПроверьте консоль";
      };

      const embed = this.buildEmbed(message, type === "error" ? "RED" : "ORANGE", '...', false, true);
      embed.setDescription(codeBlock(stack as string));
      embed.addField("Name", name, true);
      embed.addField("Code", code.toString(), true);
      embed.addField("HTTP Status", httpStatus.toString(), true);
      embed.addField("Timestamp", new Date().toLocaleString("ru"), true);
      embed.addField("Request Data", codeBlock(jsonString?.substring(0, 2045)), true);

      channel.send({
        embeds: [embed]
      });
    } 
    catch (e) {
      console.warn({
        error
      });

      console.warn(e);
    };
  }

  async checkForDJRole(message: Message): Promise<DJRoleStatus> {
    const roles = this.client.database.getSetting(message.guild, 'djRoles');
    if(!roles.length) return {
      status: false,
      message: 'No DJ Roles in DB!'
    };

    for(const { roleID } of roles) {
      const guildRole = message.guild.roles.cache.get(roleID);
      if(!guildRole) return;

      const memberRole = message.member.roles.cache.get(guildRole.id);
      
      if(!memberRole) {
        return {
          status: false,
          message: 'Member hasn\'t any DJ Role!'
        }
      }
      else return {
        status: true
      };
    }
  }
};

type WarningTypes = "warning" | "error";

interface Birthday {
  status: boolean;
  years?: number;
}

interface DJRoleStatus {
  status: boolean;
  message?: string;
}