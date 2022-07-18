import {
	ActionRowBuilder,
	bold,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	TextChannel,
} from "discord.js";
import { LanguageService } from "../services/Language";
import { GuildService } from "../services/Guild";
import Bot from "../classes/Bot";

interface StreamData {
	guild_id: string;
	stream_id: string;
	streamer: string;
	stream_title: string;
	profile_url: string;
	thumbnail_url: string;
	viewers: number;
	started_at: number;
}

export = async (client: Bot, data: StreamData) => {
	const language_service = new LanguageService(client, data.guild_id);
	const guild_service = new GuildService(client);
	const TWITCH = await (await language_service.all()).TWITCH_SYSTEM;
	const text = await language_service.get(
		"TWITCH_SYSTEM:STREAM_STARTED",
		data.streamer
	);

	const color = client.functions.color("#6441a5");
	const embed = new EmbedBuilder();
	embed.setColor(color);
	embed.setAuthor({
		name: data.streamer,
		iconURL: data.profile_url,
	});
	embed.setTitle(data.stream_title);
	embed.setURL(data.profile_url);
	embed.setThumbnail(data.thumbnail_url);
	embed.setTimestamp(data.started_at);
	embed.setDescription(
		[
			`${bold(text)}`,
			"",
			`› ${bold(TWITCH.STREAM_TITLE)}: ${bold(data.stream_title)}`,
			`› ${bold(TWITCH.VIEWERS)}: ${bold(
				data.viewers.toLocaleString("be")
			)}`,
		].join("\n")
	);

	const button = new ButtonBuilder();
	button.setLabel("▶");
	button.setStyle(ButtonStyle.Link);
	button.setURL(data.profile_url);

	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents([button]);

	const guild = client.guilds.cache.get(data.guild_id);
	const channel_id = guild_service.getSetting(
		data.guild_id,
		"twitch_channel"
	);

	const channel = guild.channels.cache.get(channel_id) as TextChannel;
	channel.send({
		embeds: [embed],
		components: [row],
	});
};
