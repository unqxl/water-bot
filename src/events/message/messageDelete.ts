import { Message, MessageEmbed, TextChannel } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";

export const name: string = "messageDelete";

export const run: RunFunction = async (client, message: Message) => {
	if (!message.inGuild()) return;
	if(message.author && message.author.bot) return;

	const logChannelID = client.database.getSetting(
		message.guild,
		"logChannel"
	);
	if (logChannelID === "0") return;

	const logChannel = message.guild.channels.cache.get(
		logChannelID
	) as TextChannel;
	if (!logChannel) return;

	const lang = await client.functions.getLanguageFile(message.guild);
	const guildLocale = client.database.getSetting(message.guild, "language");

	var title, description;

	const ghostPingCheck = await client.moderation.systems.ghostPing(message);
	if(ghostPingCheck) {
		// Texts
		title = lang.EVENTS.MESSAGE_EVENTS.DELETE.GHOST_PING.TITLE,
		description = lang.EVENTS.MESSAGE_EVENTS.DELETE.GHOST_PING.DESCRIPTION
		.replace("{author}", message.author.toString())
		.replace("{content}", message.content ?? lang.GLOBAL.NONE)
	}
	else {
		// Texts
		title = lang.EVENTS.MESSAGE_EVENTS.DELETE.TITLE,
		description = lang.EVENTS.MESSAGE_EVENTS.DELETE.DESCRIPTION
		.replace("{author}", message.author.toString())
		.replace("{content}", message.content ?? lang.GLOBAL.NONE)
		.replace("{date}", new Date().toLocaleString(guildLocale));
	};

	const embed = new MessageEmbed()
	.setColor("BLURPLE")
	.setAuthor({
		name: message.author.tag,
		iconURL: message.author.displayAvatarURL({ dynamic: true })
	})
	.setTitle(title)
	.setDescription(bold(description))
	.setTimestamp();

	return logChannel.send({
		embeds: [embed],
	});
};
