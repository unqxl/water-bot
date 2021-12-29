import { GuildMember, MessageEmbed, Role, TextChannel } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";

export const name: string = "guildMemberRoleAdd";

export const run: RunFunction = async (
	client,
	member: GuildMember,
	role: Role
) => {
	const logsChannelID = client.database.getSetting(
		member.guild,
		"logChannel"
	);
	if (logsChannelID === "0") return;

	const logsChannel = member.guild.channels.cache.get(
		logsChannelID
	) as TextChannel;
	if (!logsChannel) return;

	const audit = await member.guild
		.fetchAuditLogs({
			type: "MEMBER_ROLE_UPDATE",
			limit: 1,
		})
		.then((value) => value.entries.first());

	if (audit.changes[0].key !== "$add") return;

	const lang = await client.functions.getLanguageFile(member.guild);
	const title = lang.EVENTS.GUILD_EVENTS.ROLE_ADD.TITLE;
	const description = bold(
		lang.EVENTS.GUILD_EVENTS.ROLE_ADD.DESCRIPTION.replace(
			"{member}",
			member.toString()
		)
			.replace("{role}", role.toString())
			.replace("{moderator}", audit.executor.toString())
	);

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor(
			member.user.tag,
			member.user.displayAvatarURL({ dynamic: true })
		)
		.setTitle(title)
		.setDescription(description)
		.setTimestamp();

	return logsChannel.send({
		embeds: [embed],
	});
};
