import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class MuteRoleResetCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "muterole-reset",
      aliases: ["mr-reset"],
      
      description: {
        en: "Deletes Mute Role from Server DB!",
        ru: "Удаляет Мут Роль с Базы Сервера!",
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
    const role = this.client.database.getSetting(message.guild, "muteRole");

    if (role === "0") {
      const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
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
    this.client.database.set(message.guild, "muteRole", "0");
    this.client.moderation.utils.database.setProp(
      message.guild.id,
      "muteRole",
      null
    );

    const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
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
