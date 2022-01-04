import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";

export const name: string = "guildMemberBoost";

export const run: RunFunction = async (client, member: GuildMember) => {
	const logsChannelID = client.database.getSetting(
		member.guild,
		"logChannel"
	);
	if (logsChannelID === "0") return;

	const logsChannel = member.guild.channels.cache.get(
		logsChannelID
	) as TextChannel;
	if (!logsChannel) return;

	const lang = await client.functions.getLanguageFile(member.guild);
	const title = lang.EVENTS.GUILD_EVENTS.MEMBER_BOOST.TITLE;
	const description = bold(
		lang.EVENTS.GUILD_EVENTS.MEMBER_BOOST.DESCRIPTION.replace(
			"{member}",
			member.toString()
		).replace(
			"{boosts}",
			client.functions.sp(member.guild.premiumSubscriptionCount)
		)
	);

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor({
			name: member.user.tag,
			iconURL: member.user.displayAvatarURL({ dynamic: true })
		})
		.setTitle(title)
		.setDescription(description)
		.setTimestamp();

	return logsChannel.send({
		embeds: [embed],
	});
};
