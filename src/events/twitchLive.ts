import {
	Guild,
	ActionRow,
	ButtonComponent,
	Embed,
	TextChannel,
	Util,
} from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";
import Bot from "classes/Bot";

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
	const GoToButton = new ButtonComponent();
	const row = new ActionRow();
	const goTo = lang.TWITCH_HANDLER.GO_TO;

	GoToButton.setStyle(5);
	GoToButton.setLabel(goTo);
	GoToButton.setURL(`https://twitch.tv/${data.name}`);
	GoToButton.setEmoji({ name: "⏯" });

	row.addComponents(GoToButton);

	return channel.send({
		embeds: [embed],
		components: [row],
	});
};

class AnnounceEmbed extends Embed {
	constructor() {
		super();
	}

	async build(
		client: Bot,
		lang: typeof import("@locales/English").default,
		data: TwitchData,
		guild: Guild
	) {
		const [newStream, title, startedAt, goTo] = [
			lang.TWITCH_HANDLER.NEW_STREAM,
			lang.TWITCH_HANDLER.STREAM_TITLE,
			lang.TWITCH_HANDLER.STARTED_AT,
			lang.TWITCH_HANDLER.GO_TO,
		];

		const locale = await client.database.getSetting(guild.id, "locale");
		const startedDate = new Date(data.date).toLocaleString(locale);
		const hyperLink = hyperlink(goTo, `https://twitch.tv/${data.name}`);
		const text = `${bold(newStream)}\n${bold(hyperLink)}\n\n› ${bold(
			title
		)}: ${bold(data.title)}\n› ${bold(startedAt)}: ${bold(startedDate)}`;

		this.setColor(Util.resolveColor("#6441a5"));
		this.setAuthor({
			name: data.name,
			iconURL: data.picture,
		});
		this.setDescription(text);
		this.setImage(data.thumbnail);
		this.setThumbnail(
			"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Twitch_logo_2019.svg/220px-Twitch_logo_2019.svg.png"
		);

		return this;
	}
}
