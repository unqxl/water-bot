import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";
import rps from "../../games/rps";

export default class RPSCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "rps",
      
      description: {
        en: "Play Rock-Papers-Scissors with Someone!",
        ru: "Поиграйте в Камень-Ножницы-Бумага с кем-то!",
      },
      
      category: Categories.GAMES,
      usage: "<prefix>rps <opponent>",
    });
  }

  async validate(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn> {
    const opponent = message.mentions.users.first();

    if (!opponent) {
      const text = lang.ERRORS.ARGS_MISSING.replace('{cmd_name}', 'rps');
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
    await message.channel.send("...").then(async (msg) => {
      return await rps(msg, message, lang);
    });
  }
}
