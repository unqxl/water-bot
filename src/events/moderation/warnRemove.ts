import { MessageEmbed, TextChannel } from "discord.js";
import { Base } from "discord-moderation/src/typings/Base";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";
import client from "../..";

interface WarnsData {
	id: number;
	guildID: string;
	memberID: string;
	moderatorID: string;
	channelID: string;
	reason: string;
}

export const name: string = "warnRemove";
export const emitter: Base = client.moderation;

export const run: RunFunction = async (client, data: WarnsData) => {
	const guild = client.guilds.cache.get(data.guildID);

	const member = guild.members.cache.get(data.memberID);
	const moderator = guild.members.cache.get(data.moderatorID);
	const channel = guild.channels.cache.get(data.channelID);
	const reason = data.reason;
	const warns = (await client.moderation.warns.all(member)).length.toString();
	const lang = await client.functions.getLanguageFile(guild);

	const [title, mMember, mModerator, cChannel, rReason, wWarns] = [
		lang.EVENTS.MODERATION.WARN_ADD.TITLE,
		lang.EVENTS.MODERATION.WARN_ADD.MEMBER,
		lang.EVENTS.MODERATION.WARN_ADD.MODERATOR,
		lang.EVENTS.MODERATION.WARN_ADD.CHANNEL,
		lang.EVENTS.MODERATION.WARN_ADD.REASON,
		lang.EVENTS.MODERATION.WARN_ADD.WARNS,
	];

	var text = "";
	text += `› ${bold(mModerator)}: ${bold(moderator.toString())}\n`;
	text += `› ${bold(mMember)}: ${bold(member.toString())}\n`;
	text += `› ${bold(cChannel)}: ${bold(channel.toString())}\n`;
	text += `› ${bold(rReason)}: ${bold(reason)}\n`;
	text += `› ${bold(wWarns)}: ${bold(warns)}`;

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor(
			moderator.user.username,
			moderator.user.displayAvatarURL({ dynamic: true })
		)
		.setTitle(title)
		.setDescription(text)
		.setTimestamp();

	const logChannelID = client.database.getSetting(guild, "logChannel");
	if (logChannelID === "0") return;

	const logChannel = guild.channels.cache.get(logChannelID) as TextChannel;
	if (!logChannel) return;

	return logChannel.send({
		embeds: [embed],
	});
};
