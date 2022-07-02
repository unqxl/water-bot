import { bold, EmbedBuilder, GuildMember } from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import Event from "../../types/Event";
import Bot from "../../classes/Bot";

export default class GuildMemberRemoveEvent extends Event {
	constructor() {
		super("guildMemberRemove");
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

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(bold(texts.bye));
			embed.setTimestamp();

			return channel.send({
				embeds: [embed],
			});
		}

		return;
	}
}
