import { Message, Util } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class PrefixCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "prefix",
      
      description: {
        en: "Changes Server Prefix!",
        ru: "Меняет Префикс Сервера!",
      },
      
      category: Categories.SETTINGS,
      usage: "<prefix>prefix [-|reset|prefix]",
    });
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const prefix = args[0];
    const current_prefix = this.client.database.getSetting(
      message.guild,
      "prefix"
    );

    if (!prefix) {
      const currentText = lang.EVENTS.GUILD_PREFIX.replace('{name}', message.guild.name).replace('{prefix}', Util.escapeMarkdown(current_prefix));
      const currentEmbed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(currentText),
        "💬",
        true
      );

      return message.channel.send({
        embeds: [currentEmbed],
      });
    } 
    else if (prefix === "reset") {
      const type = lang.SETTINGS.CONFIG.TYPES.PREFIX;
      const resetText = lang.SETTINGS.RESETTED(type, '-');
      const resetEmbed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(resetText),
        "✅",
        true
      );

      this.client.database.set(message.guild, "prefix", "-");

      return message.channel.send({
        embeds: [resetEmbed],
      });
    } 
    else {
      const type = lang.SETTINGS.CONFIG.TYPES.PREFIX;
      const changedText = lang.SETTINGS.SETTED(type, prefix);
      const changedEmbed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(changedText),
        "✅",
        true
      );

      this.client.database.set(message.guild, "prefix", prefix);

      return message.channel.send({
        embeds: [changedEmbed],
      });
    }
  }
}
