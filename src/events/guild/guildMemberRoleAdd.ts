import { GuildMember, EmbedBuilder, Role, TextChannel, Util } from "discord.js";
import { AuditLogEvent } from "discord-api-types/v9";
import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";

export default class GuildMemberRoleAddEvent extends Event {
	constructor() {
		super("guildMemberRoleAdd");
	}

	async run(client: Bot, member: GuildMember, role: Role) {
		const settings = await client.database.getSettings(member.guild.id);
		if (!settings.log_channel) return;

		const log_channel = member.guild.channels.cache.get(
			settings.log_channel
		) as TextChannel;
		if (!log_channel) return;

		const { executor, changes } = await (
			await member.guild.fetchAuditLogs({
				type: AuditLogEvent.MemberRoleUpdate,
				limit: 1,
			})
		).entries.first();
		if (changes[0].key !== "$add") return;

		const lang_file = await client.functions.getLanguageFile(
			member.guild.id
		);
		const title = lang_file.EVENTS.GUILD_EVENTS.ROLE_ADD.TITLE;
		const description = lang_file.EVENTS.GUILD_EVENTS.ROLE_ADD.DESCRIPTION(
			member.toString(),
			role.toString(),
			executor.toString()
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

		return log_channel.send({
			embeds: [embed.toJSON()],
		});
	}
}
