import { GuildChannel, MessageEmbed, TextChannel } from "discord.js";
import { bold, inlineCode } from "@discordjs/builders";
import { RunFunction } from "../../interfaces/Event";

export const name: string = "channelDelete";

export const run: RunFunction = async (client, channel: GuildChannel) => {
	const logChannelID = client.database.getSetting(
		channel.guild,
		"logChannel"
	);
	if (logChannelID === "0") return;

	const logChannel = channel.guild.channels.cache.get(
		logChannelID
	) as TextChannel;
	if (!logChannel) return;

	const lang = await client.functions.getLanguageFile(channel.guild);
	const channelTypes = {
		GUILD_TEXT: lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.TEXT,
		GUILD_VOICE: lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.VOICE,
		GUILD_CATEGORY: lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.CATEGORY,
		GUILD_NEWS: lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.NEWS,
		GUILD_STORE: lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.STORE,
		GUILD_NEWS_THREAD: lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.NEWS_THREAD,
		GUILD_PUBLIC_THREAD:
			lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.PUBLIC_THREAD,
		GUILD_PRIVATE_THREAD:
			lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.PRIVATE_THREAD,
		GUILD_STAGE_VOICE: lang.EVENTS.CHANNEL_EVENTS.CHANNEL_TYPES.STAGE,
	};

	const locale = client.database.getSetting(channel.guild, "language");
	const deletedAt = new Date().toLocaleString(locale);
	const channelType = channelTypes[channel.type];
	const { executor } = await channel.guild
		.fetchAuditLogs({
			type: "CHANNEL_DELETE",
			limit: 1,
		})
		.then((val) => val.entries.first());

	const [title, type, Channel, moderator, date] = [
		lang.EVENTS.CHANNEL_EVENTS.DELETE.TITLE,
		lang.EVENTS.CHANNEL_EVENTS.DELETE.TYPE,
		lang.EVENTS.CHANNEL_EVENTS.DELETE.CHANNEL,
		lang.EVENTS.CHANNEL_EVENTS.DELETE.MODERATOR,
		lang.EVENTS.CHANNEL_EVENTS.DELETE.DATE,
	];

	var text = "";
	text += `› ${bold(type)}: ${bold(channelType)}\n`;
	text += `› ${bold(Channel)}: ${bold(channel.name)} (${inlineCode(
		channel.id
	)})\n`;
	text += `› ${bold(moderator)}: ${bold(executor.toString())} (${inlineCode(
		executor.id
	)})\n`;
	text += `› ${bold(date)}: ${bold(deletedAt)}`;

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor({
			name: channel.guild.name, 
			iconURL: channel.guild.iconURL({ dynamic: true })
		})
		.setTitle(title)
		.setDescription(text)
		.setTimestamp();

	return logChannel.send({
		embeds: [embed],
	});
};
