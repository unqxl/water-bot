import { Message, MessageEmbed, TextChannel } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";

export const name: string = "messageDelete";

export const run: RunFunction = async (client, message: Message) => {
	if (!message.inGuild()) return;

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

	// Texts
	const [title, description] = [
		lang.EVENTS.MESSAGE_EVENTS.DELETE.TITLE,
		lang.EVENTS.MESSAGE_EVENTS.DELETE.DESCRIPTION.replace(
			"{author}",
			message.author.toString()
		)
		.replace("{content}", message.content ?? lang.GLOBAL.NONE)
		.replace("{date}", new Date().toLocaleString(guildLocale)),
	];

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor(
			message.author.tag,
			message.author.displayAvatarURL({ dynamic: true })
		)
		.setTitle(title)
		.setDescription(bold(description))
		.setTimestamp();

	return logChannel.send({
		embeds: [embed],
	});
};
