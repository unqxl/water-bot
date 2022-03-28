import { Guild, EmbedBuilder, User, Util } from "discord.js";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";

export default class GuildCreateEvent extends Event {
	constructor(private guildConfigRepository) {
		super("guildCreate");

		this.guildConfigRepository =
			this.client.datasource.getRepository(GuildConfiguration);
	}

	async run(client: Bot, guild: Guild) {
		await client.database.createGuild(guild.id);

		const config = await this.guildConfigRepository.findOne({
			where: { guild_id: guild.id },
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

		const embed = new EmbedBuilder()
			.setColor(Util.resolveColor("Blurple"))
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
			embeds: [embed.toJSON()],
		});
	}
}
