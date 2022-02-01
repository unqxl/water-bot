import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

export default class GuildMemberBoostEvent extends Event {
	constructor() {
		super("guildMemberBoost");
	}

	async run(client: Bot, member: GuildMember) {
		const settings = await client.database.getSettings(member.guild.id);
		if (!settings.log_channel) return;

		const log_channel = member.guild.channels.cache.get(
			settings.log_channel
		) as TextChannel;
		if (!log_channel) return;

		const lang_file = await client.functions.getLanguageFile(
			member.guild.id
		);
		const title = lang_file.EVENTS.GUILD_EVENTS.MEMBER_BOOST.TITLE;
		const description =
			lang_file.EVENTS.GUILD_EVENTS.MEMBER_BOOST.DESCRIPTION(
				member.user.tag,
				client.functions.sp(member.guild.premiumSubscriptionCount)
			);

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		const embed = new MessageEmbed()
			.setColor("BLURPLE")
			.setAuthor({
				name: member.user.tag,
				iconURL: member.user.displayAvatarURL({ dynamic: true }),
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
