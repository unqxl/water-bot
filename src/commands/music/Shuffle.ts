import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class ShuffleCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "shuffle",
      
      description: {
        en: "Shuffles Server Music Queue!",
        ru: "Перемешивает Музыкальную Очередь Сервера!",
      },
      
      category: Categories.MUSIC,
      usage: "<prefix>shuffle",
    });
  }

  async validate(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn> {
    const [ error, voice_error ] = await Promise.all([
      lang.ERRORS.NOT_JOINED_VOICE,
      lang.ERRORS.JOIN_BOT_VOICE,
    ]);

    if (!message.member.voice.channel) {
      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(error),
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

    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel &&
      message.member.voice.channel !== message.guild.me.voice.channel
    ) {
      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(voice_error),
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

    const queue = this.client.music.getQueue(message);
    if (!queue) {
      const text = lang.ERRORS.QUEUE_EMPTY;
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
    const queue = this.client.music.getQueue(message);
    queue.shuffle();

    const text = lang.MUSIC.SHUFFLED;
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
