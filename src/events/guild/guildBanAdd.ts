import { GuildBan, MessageEmbed, TextChannel } from "discord.js";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";

export default class GuildBanAddEvent extends Event {
	constructor() {
		super("guildBanAdd");
	}

	async run(client: Bot, ban: GuildBan) {
		const settings = await client.database.getSettings(ban.guild.id);
		if (!settings.log_channel) return;

		const log_channel = ban.guild.channels.cache.get(
			settings.log_channel
		) as TextChannel;
		if (!log_channel) return;

		const lang_file = await client.functions.getLanguageFile(ban.guild.id);
		const { target, executor, reason } = await (
			await ban.guild.fetchAuditLogs({
				type: "MEMBER_BAN_ADD",
				limit: 1,
			})
		).entries.first();

		const title = lang_file.EVENTS.GUILD_EVENTS.BAN_ADD.TITLE;
		const description = lang_file.EVENTS.GUILD_EVENTS.BAN_ADD.DESCRIPTION(
			target.toString(),
			target.tag,
			executor.toString(),
			reason
		);

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		const embed = new MessageEmbed()
			.setColor("BLURPLE")
			.setAuthor({
				name: target.tag,
				iconURL: target.displayAvatarURL({ dynamic: true }),
			})
			.setTitle(title)
			.setDescription(description)
			.setFooter({
				text: happend_at,
			});

		return log_channel.send({
			embeds: [embed],
		});
	}
}
