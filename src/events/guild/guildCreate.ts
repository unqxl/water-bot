import { Guild, MessageEmbed, User } from "discord.js";
import { getRepository } from "typeorm";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import Bot from "classes/Bot";
import Event from "../../types/Event/Event";

export default class GuildCreateEvent extends Event {
	constructor(
		private readonly guildConfigRepository = getRepository(
			GuildConfiguration
		)
	) {
		super("guildCreate");
	}

	async run(client: Bot, guild: Guild) {
		await client.database.createGuild(guild.id);

		const config = await this.guildConfigRepository.findOne({
			guild_id: guild.id,
		});

		if (config) console.log(`Configruration of ${guild.id} was found!`);
		else {
			console.log(`Configruration of ${guild.id} wasn't found!`);

			const newConfig = await this.guildConfigRepository.create({
				guild_id: guild.id,
			});

			return this.guildConfigRepository.save(newConfig);
		}

		const owner = client.users.cache.get("852921856800718908") as User;
		const guildOwner = await guild.fetchOwner();

		const embed = new MessageEmbed()
			.setColor("BLURPLE")
			.setTitle("🎉 New Server 🎉")
			.setDescription(
				`› **Name**: **${guild.name}** (**${
					guild.id
				}**)\n› **Members**: **${client.functions.sp(
					guild.memberCount
				)}**\n› **Owner**: **${guildOwner.user.tag}**`
			)
			.setTimestamp();

		return owner.send({
			embeds: [embed],
		});
	}
}
