import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class VolumeCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "volume",
      aliases: ["vol"],
      
      description: {
        en: "Changes Server Music Queue Volume!",
        ru: "Меняет Громкость Очереди Песен!",
      },
      
      category: Categories.MUSIC,
      usage: "<prefix>volume [volume]",
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
    if (!queue || !queue.songs.length) {
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

    const volume = args[0];
    if (volume) {
      if (!Number(volume)) {
        const text = lang.ERRORS.IS_NAN.replace('{input}', volume);
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
    }

    return {
      ok: true,
    };
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const queue = this.client.music.getQueue(message);
    const volume = args[0];

    if (!volume) {
      const current_volume = queue.volume;
      const volumeText = lang.MUSIC.VOLUME_NOW(current_volume);
      const nowEmbed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(volumeText),
        "✅",
        true
      );

      return message.channel.send({
        embeds: [nowEmbed],
      });
    }

    const newQueue = queue.setVolume(Number(volume));
    const text = lang.MUSIC.VOLUME_SETTED(newQueue.volume);
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
