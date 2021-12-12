import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class LoopCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "loop",
      aliases: ["repeat"],
      
      description: {
        en: "Changes Music Repeat Mode!",
        ru: "Меняет Режим Повторения Песни!",
      },
      
      category: Categories.MUSIC,
      usage: "<prefix>loop <song|queue|off>",
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

    return {
      ok: true,
    };
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const queue = this.client.music.getQueue(message);
    var mode = null;

    const [ mode_off, mode_song, mode_queue ] = await Promise.all([
      lang.MUSIC.LOOP_MODES.OFF,
      lang.MUSIC.LOOP_MODES.SONG,
      lang.MUSIC.LOOP_MODES.QUEUE,
    ]);

    switch (args[0]) {
      case "off": {
        mode = 0;
        break;
      }

      case "song": {
        mode = 1;
        break;
      }

      case "queue": {
        mode = 2;
        break;
      }

      default: {
        mode = queue.repeatMode === 1 ? 0 : 1;
        break;
      }
    }

    mode = queue.setRepeatMode(mode);
    mode = mode ? (mode === 2 ? mode_queue : mode_song) : mode_off;

    const text = lang.MUSIC.LOOP_CHANGES(mode);
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
