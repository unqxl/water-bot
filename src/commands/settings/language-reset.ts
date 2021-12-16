import { Categories } from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class LanguageSetCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "language-reset",
      
      description: {
        en: "Resets Server Language to Default!",
        ru: "Сбрасывает Язык Сервера на Стандартный!",
      },
      
      category: Categories.SETTINGS,
      memberPermissions: ["ADMINISTRATOR"],
    });
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    this.client.database.set(message.guild, "language", "en-US");

    const language = this.client.database.getSetting(message.guild, 'language');
    const text = lang.SETTINGS.RESETTED(language === 'en-US' ? 'Language' : 'Язык', 'en-US');
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
