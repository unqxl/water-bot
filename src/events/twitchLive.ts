import {
  Guild,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";
import Goose from "classes/Goose";

interface TwitchData {
  name: string;
  picture: string;
  title: string;
  thumbnail: string;
  date: number;
}

export = async (client: Goose, lang: typeof import('@locales/English').default, channel: TextChannel, data: TwitchData) => {
  const embed = await new AnnounceEmbed().build(client, lang, data, channel.guild);
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

  async build(client: Goose, lang: typeof import('@locales/English').default, data: TwitchData, guild: Guild) {
    const [ newStream, title, startedAt, goTo ] = [
      lang.TWITCH_HANDLER.NEW_STREAM,
      lang.TWITCH_HANDLER.STREAM_TITLE,
      lang.TWITCH_HANDLER.STARTED_AT,
      lang.TWITCH_HANDLER.GO_TO,
    ];

    const locale = client.database.getSetting(guild, 'language');
    const startedDate = new Date(data.date).toLocaleString(locale);
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
