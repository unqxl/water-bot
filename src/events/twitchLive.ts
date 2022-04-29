import {
	Guild,
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	TextChannel,
	Util,
} from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";
import Bot from "../classes/Bot";

interface TwitchData {
	name: string;
	picture: string;
	title: string;
	thumbnail: string;
	date: number;
}

export = async (
	client: Bot,
	lang: typeof import("@locales/English").default,
	channel: TextChannel,
	data: TwitchData
) => {
	const embed = await new AnnounceEmbed().build(
		client,
		lang,
		data,
		channel.guild
	);
	const GoToButton = new ButtonBuilder();
	const row = new ActionRowBuilder<ButtonBuilder>();
	const goTo = lang.TWITCH_HANDLER.GO_TO;

	GoToButton.setStyle(5);
	GoToButton.setLabel(goTo);
	GoToButton.setURL(`https://twitch.tv/${data.name}`);
	GoToButton.setEmoji({ name: "⏯" });

	row.addComponents([GoToButton]);

	return channel.send({
		embeds: [embed.toJSON()],
		components: [row],
	});
};

class AnnounceEmbed extends EmbedBuilder {
	constructor() {
		super();
	}

	async build(
		client: Bot,
		lang: typeof import("@locales/English").default,
		data: TwitchData,
		guild: Guild
	) {
		const twitch_icon =
			"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Twitch_logo_2019.svg/220px-Twitch_logo_2019.svg.png";

		const [newStream, title, startedAt, goTo] = [
			lang.TWITCH_HANDLER.NEW_STREAM,
			lang.TWITCH_HANDLER.STREAM_TITLE,
			lang.TWITCH_HANDLER.STARTED_AT,
			lang.TWITCH_HANDLER.GO_TO,
		];

		const locale = await client.database.getSetting(guild.id, "locale");
		const startedDate = new Date(data.date).toLocaleString(locale);
		const hyperLink = hyperlink(goTo, `https://twitch.tv/${data.name}`);
		const text = [
			bold(newStream),
			bold(hyperLink),
			"",
			`${bold(title)}: ${bold(data.title)}`,
			`› ${bold(startedAt)}: ${bold(startedDate)}`,
		].join("\n");

		this.setAuthor({
			name: data.name,
			iconURL: data.picture,
		});

		this.setColor(Util.resolveColor("#6441a5"));
		this.setDescription(text);
		this.setImage(data.thumbnail);
		this.setThumbnail(twitch_icon);

		return this;
	}
}
