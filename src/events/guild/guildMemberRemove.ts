import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

export default class GuildMemberRemoveEvent extends Event {
	constructor() {
		super("guildMemberRemove");
	}

	async run(client: Bot, member: GuildMember) {
		const settings = await client.database.getSettings(member.guild.id);
		if (!settings.log_channel) return;

		const members_channel = member.guild.channels.cache.get(
			settings.members_channel
		) as TextChannel;
		if (!members_channel) return;

		const lang_file = await client.functions.getLanguageFile(
			member.guild.id
		);
		const title = lang_file.EVENTS.GUILD_EVENTS.MEMBER_REMOVE.TITLE;
		const description =
			lang_file.EVENTS.GUILD_EVENTS.MEMBER_REMOVE.DESCRIPTION(
				member.user.tag
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

		return members_channel.send({
			embeds: [embed],
		});
	}
}
