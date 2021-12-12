import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message, Util } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class NowPlayingCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "nowplaying",
      aliases: ["np"],
      
      description: {
        en: "Displays Information about Current Playing Song!",
        ru: "Показывает Информацию о Играющей Песне!",
      },
      
      category: Categories.MUSIC,
      usage: "<prefix>nowplaying",
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
    const description = lang.MUSIC.NOW_PLAYING(
      Util.escapeMarkdown(queue.songs[0].name!)
    );

    const [ songTitle, songURL, songViews, durationText, requestedByText ] =
      await Promise.all([
        lang.MUSIC.SONG_INFO.NAME,
        lang.MUSIC.SONG_INFO.URL,
        lang.MUSIC.SONG_INFO.VIEWS,
        lang.MUSIC.SONG_INFO.DURATION,
        lang.MUSIC.SONG_INFO.REQUESTED_BY,
      ]);

    const song = queue.songs[0];
    const title = Util.escapeMarkdown(song.name);
    const info = [
      `› ${bold(songTitle)}: ${bold(title)}`,
      `› ${bold(songURL)}: ${bold(`<${song.url}>`)}`,
      `› ${bold(songViews)}: ${bold(this.client.functions.sp(song.views))}`,
      `› ${bold(durationText)}: ${bold(song.formattedDuration)}`,
      `› ${bold(requestedByText)}: ${bold(song.user.toString())}`,
    ];

    const text = `${bold(description)}:\n${info.join("\n")}`;
    const embed = this.client.functions.buildEmbed(
      message,
      "BLURPLE",
      text,
      false,
      true
    );

    return message.channel.send({
      embeds: [embed],
    });
  }
}
