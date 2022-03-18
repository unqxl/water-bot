import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import { GuildMember, EmbedBuilder, TextChannel, Util } from "discord.js";

export default class GuildMemberAddEvent extends Event {
	constructor() {
		super("guildMemberAdd");
	}

	async run(client: Bot, member: GuildMember) {
		await autoRole(client, member);

		const settings = await client.database.getSettings(member.guild.id);
		if (!settings.log_channel) return;

		const members_channel = member.guild.channels.cache.get(
			settings.members_channel
		) as TextChannel;
		if (!members_channel) return;

		const lang_file = await client.functions.getLanguageFile(
			member.guild.id
		);
		const title = lang_file.EVENTS.GUILD_EVENTS.MEMBER_ADD.TITLE;
		const description =
			lang_file.EVENTS.GUILD_EVENTS.MEMBER_ADD.DESCRIPTION(
				member.toString()
			);

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		const embed = new EmbedBuilder()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: member.user.tag,
				iconURL: member.user.displayAvatarURL(),
			})
			.setTitle(title)
			.setDescription(description)
			.setFooter({
				text: happend_at,
			});

		return members_channel.send({
			embeds: [embed.toJSON()],
		});
	}
}

async function autoRole(client: Bot, member: GuildMember) {
	const autoRoleID = await client.database.getSetting(
		member.guild.id,
		"auto_role"
	);
	if (!autoRoleID) return false;

	const autoRole = member.guild.roles.cache.get(autoRoleID);
	if (!autoRole) return false;

	if (member.roles.cache.get(autoRole.id)) return false;
	else await member.roles.add(autoRole);

	return true;
}
