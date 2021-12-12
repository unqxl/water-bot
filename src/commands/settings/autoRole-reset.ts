import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class AutoRoleResetCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "autorole-reset",
      aliases: ["ar-reset"],
      
      description: {
        en: "Deletes Auto Role from Server DB!",
        ru: "Удаляет Авто Роль с Базы Сервера!",
      },
      
      category: Categories.SETTINGS,
      memberPermissions: ["ADMINISTRATOR"],
    });
  }

  async validate(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn> {
    const role = this.client.database.getSetting(message.guild, "autoRole");

    if (role === "0") {
      const type = lang.SETTINGS.CONFIG.TYPES.AUTO_ROLE;
      const text = lang.ERRORS.MISSING_IN_DB(type);
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
    this.client.database.set(message.guild, "autoRole", "0");

    const type = lang.SETTINGS.CONFIG.TYPES.AUTO_ROLE;
    const text = lang.SETTINGS.RESETTED(type);
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
