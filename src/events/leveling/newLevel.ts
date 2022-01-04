import { MessageEmbed, TextChannel } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { EventEmitter } from "events";
import client from "../../index";

interface NewLevelData {
	userID: string;
	guildID: string;
	channelID: string;
	level: number;
}

export const name: string = "newLevel";
export const emitter: EventEmitter = client.levels;

export const run: RunFunction = async (client, data: NewLevelData) => {
	const guild = client.guilds.cache.get(data.guildID);
	const user = guild.members.cache.get(data.userID);
	const channel = guild.channels.cache.get(data.channelID) as TextChannel;
	const lang = await client.functions.getLanguageFile(guild);
	var text = lang.EVENTS.LEVELING.NEWLEVEL.replace(
		"{user}",
		user.toString()
	).replace("{level}", client.functions.sp(data.level));

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor({
			name: user.user.username,
			iconURL: user.user.displayAvatarURL({ dynamic: true })
		})
		.setDescription(text)
		.setTimestamp();

	return channel.send({
		embeds: [embed],
	});
};
