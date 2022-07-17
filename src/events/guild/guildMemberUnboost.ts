import { bold, EmbedBuilder, GuildMember } from "discord.js";
import { GuildService } from "../../services/Guild";
import Event from "../../types/Event";
import Bot from "../../classes/Bot";

export default class GuildMemberBoostEvent extends Event {
	constructor() {
		super("guildMemberBoost");
	}

	async run(client: Bot, member: GuildMember) {
		const service = new GuildService(client);

		const texts = await service.getSetting(member.guild.id, "texts");
		const members_channel = service.getSetting(
			member.guild.id,
			"members_channel"
		);

		if (members_channel) {
			const channel = member.guild.channels.cache.get(members_channel);
			if (!channel) return;
			if (!channel.isTextBased()) return;

			const color = client.functions.color("Blurple");
			const author = client.functions.author(member);
			const text = bold(
				texts.unboost
					.replace("%s", member.toString())
					.replace("%s1", member.user.tag)
					.replace("%s2", member.guild.premiumSubscriptionCount.toString())
			);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(text);
			embed.setTimestamp();

			return channel.send({
				embeds: [embed],
			});
		}

		return;
	}
}
