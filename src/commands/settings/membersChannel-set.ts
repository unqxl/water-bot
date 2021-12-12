import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class MembersChannelSetCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "memberschannel-set",
      aliases: ["mc-set"],
      
      description: {
        en: "Sets new Members Channel to Server DB!",
        ru: "Ставит Канал для Участников в Базу Сервера!",
      },
      
      usage: "<prefix>memberschannel-set <channel>",
      category: Categories.SETTINGS,
      memberPermissions: ["ADMINISTRATOR"],
    });
  }

  async validate(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn> {
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!channel) {
      const text = lang.ERRORS.ARGS_MISSING.replace('{cmd_name}', 'memberschannel-set');
      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(text),
        "❌",
        true
      );

      return {
        ok: false,
        error: {
          embeds: [embed],
        },
      };
    }

    if (!["GUILD_TEXT", "GUILD_NEWS"].includes(channel.type)) {
      const text = lang.ERRORS.CHANNEL_TYPE;
      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(text),
        "❌",
        true
      );

      return {
        ok: false,
        error: {
          embeds: [embed],
        },
      };
    }

    return {
      ok: true,
    };
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    this.client.database.set(message.guild, "membersChannel", channel.id);

    const type = lang.SETTINGS.CONFIG.TYPES.MEMBERS_CHANNEL;
    const text = lang.SETTINGS.SETTED(type, channel.toString());
    const embed = this.client.functions.buildEmbed(
      message,
      "BLURPLE",
      bold(text),
      "✅",
      true
    );

    return message.channel.send({
      embeds: [embed],
    });
  }
}
