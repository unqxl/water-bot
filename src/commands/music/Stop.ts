import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class StopCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "stop",
      
      description: {
        en: "Stops Playing Server Music!",
        ru: "Прекращает проигрывать Серверную Очередь!",
      },
      
      category: Categories.MUSIC,
      usage: "<prefix>stop",
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
    queue.stop();

    const text = lang.MUSIC.STOPPED;
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
