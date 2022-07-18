import { GuildService } from "../../services/Guild";
import { EmbedBuilder, Guild } from "discord.js";
import Event from "../../types/Event";
import Bot from "../../classes/Bot";

export default class GuildCreateEvent extends Event {
	constructor() {
		super("guildCreate");
	}

	async run(client: Bot, guild: Guild) {
		const service = new GuildService(client);
		service.create(guild.id);

		const embed = new EmbedBuilder();
		embed.setColor("Blurple");
		embed.setAuthor({
			name: guild.name,
			iconURL: guild.iconURL(),
		});
		embed.setDescription(
			[
				`🎉 | **Bot has been added to new server!**`,
				`› **Name**: **${guild.name}**`,
				`› **ID**: **${guild.id}**`,
				`› **Owner**: **${await (await guild.fetchOwner()).toString()} (${
					guild.ownerId
				})**`,
				`› **Members**: **${guild.members.cache.size.toLocaleString("be")}**`,
			].join("\n")
		);

		const user = client.users.cache.get(client.owners[0]);
		if (!user) return;

		return user.send({
			embeds: [embed],
		});
	}
}
