import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";

export const name: string = "guildVerificationAdd";

export const run: RunFunction = async (client, guild: Guild) => {
	const logsChannelID = client.database.getSetting(guild, "logChannel");
	if (logsChannelID === "0") return;

	const logsChannel = guild.channels.cache.get(logsChannelID) as TextChannel;
	if (!logsChannel) return;

	const lang = await client.functions.getLanguageFile(guild);
	const title = lang.EVENTS.GUILD_EVENTS.VERIFIED.TITLE;
	const description = bold(lang.EVENTS.GUILD_EVENTS.VERIFIED.DESCRIPTION);

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
		.setTitle(title)
		.setDescription(description)
		.setTimestamp();

	return logsChannel.send({
		embeds: [embed],
	});
};
