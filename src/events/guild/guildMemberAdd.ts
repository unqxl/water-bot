import { bold, EmbedBuilder, GuildMember } from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import Event from "../../types/Event";
import Bot from "../../classes/Bot";

export default class GuildMemberAddEvent extends Event {
	constructor() {
		super("guildMemberAdd");
	}

	async run(client: Bot, member: GuildMember) {
		const service = new GuildService(client);

		const texts = await service.getSetting(member.guild.id, "texts");
		const auto_role = service.getSetting(member.guild.id, "auto_role");
		const members_channel = service.getSetting(
			member.guild.id,
			"members_channel"
		);

		if (auto_role) {
			await member.roles.add(auto_role);
		}

		if (members_channel) {
			const channel = member.guild.channels.cache.get(members_channel);
			if (!channel) return;
			if (!channel.isTextBased()) return;

			const color = client.functions.color("Blurple");
			const author = client.functions.author(member);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(bold(texts.welcome));
			embed.setTimestamp();

			return channel.send({
				embeds: [embed],
			});
		}

		return;
	}
}
