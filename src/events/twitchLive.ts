import {
  Guild,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";
import dayjs from "dayjs";

import("dayjs/locale/en");
import("dayjs/locale/ru");

interface TwitchData {
  name: string;
  picture: string;
  title: string;
  thumbnail: string;
  date: number;
}

export = async (lang: typeof import('@locales/English').default, channel: TextChannel, data: TwitchData) => {
  const embed = await new AnnounceEmbed().build(lang, data);
  const GoToButton = new MessageButton();
  const row = new MessageActionRow();
  const goTo = lang.TWITCH_HANDLER.GO_TO;

  GoToButton.setStyle("LINK");
  GoToButton.setLabel(goTo);
  GoToButton.setURL(`https://twitch.tv/${data.name}`);
  GoToButton.setEmoji("⏯");

  row.addComponents([GoToButton]);

  return channel.send({
    embeds: [embed],
    components: [row],
  });
};

class AnnounceEmbed extends MessageEmbed {
  constructor() {
    super();
  }

  async build(lang: typeof import('@locales/English').default, data: TwitchData) {
    const [ newStream, title, startedAt, goTo ] = [
      lang.TWITCH_HANDLER.NEW_STREAM,
      lang.TWITCH_HANDLER.STREAM_TITLE,
      lang.TWITCH_HANDLER.STARTED_AT,
      lang.TWITCH_HANDLER.GO_TO,
    ];

    const startedDate = dayjs(data.date).format("YYYY-MM-DD, HH:mm:ss");
    const hyperLink = hyperlink(goTo, `https://twitch.tv/${data.name}`);
    const text = `${bold(newStream)}\n${bold(hyperLink)}\n\n› ${bold(
      title
    )}: ${bold(data.title)}\n› ${bold(startedAt)}: ${bold(startedDate)}`;

    this.setColor("#6441a5");
    this.setAuthor(data.name, data.picture);
    this.setDescription(text);
    this.setImage(data.thumbnail);
    this.setThumbnail(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Twitch_logo_2019.svg/220px-Twitch_logo_2019.svg.png"
    );

    return this;
  }
}
