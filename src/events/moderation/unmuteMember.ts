import { MessageEmbed, TextChannel } from "discord.js";
import { Base } from "discord-moderation/src/typings/Base";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";
import client from "../..";
import ms from "ms";

interface unMuteMember {
	id: number;
	type: string;
	guildID: string;
	memberID: string;
	moderatorID: string;
	channelID: string;
	reason: string;
	time?: number;
	unmutedAt?: number;
}

export const name: string = "unmuteMember";
export const emitter: Base = client.moderation;

export const run: RunFunction = async (client, data: unMuteMember) => {
	const guild = client.guilds.cache.get(data.guildID);
	const lang = await client.functions.getLanguageFile(guild);
	const guildLocale = client.database.getSetting(guild, "language");

	const member = guild.members.cache.get(data.memberID);
	const moderator = guild.members.cache.get(data.moderatorID);
	const channel = guild.channels.cache.get(data.channelID);
	const reason = data.reason;

	const temporaryMute = lang.EVENTS.MODERATION.MUTE_TYPES.TEMPORARY;
	const defaultMute = lang.EVENTS.MODERATION.MUTE_TYPES.DEFAULT;

	const [tType, mMember, mModerator, cChannel, rReason, tTime] = [
		lang.EVENTS.MODERATION.UNMUTE_MEMBER.TYPE,
		lang.EVENTS.MODERATION.UNMUTE_MEMBER.MEMBER,
		lang.EVENTS.MODERATION.UNMUTE_MEMBER.MODERATOR,
		lang.EVENTS.MODERATION.UNMUTE_MEMBER.CHANNEL,
		lang.EVENTS.MODERATION.UNMUTE_MEMBER.REASON,
		lang.EVENTS.MODERATION.UNMUTE_MEMBER.TIME,
	];

	var type = "";
	var title = "";
	var text = "";

	if (data.type === "tempmute") {
		type = temporaryMute;
		title = lang.EVENTS.MODERATION.UNMUTE_MEMBER.TEMPORARY_TITLE;
	} else if (data.type === "mute") {
		type = defaultMute;
		title = lang.EVENTS.MODERATION.UNMUTE_MEMBER.DEFAULT_TITLE;
	}

	text += `› ${bold(tType)}: ${bold(type)}\n`;
	text += `› ${bold(mMember)}: ${bold(member.toString())}\n`;
	text += `› ${bold(mModerator)}: ${bold(moderator.toString())}\n`;
	text += `› ${bold(cChannel)}: ${bold(channel.toString())}\n`;
	text += `› ${bold(rReason)}: ${bold(reason)}\n`;

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
