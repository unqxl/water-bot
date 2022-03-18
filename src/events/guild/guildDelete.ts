import { Guild, EmbedBuilder, User, Util } from "discord.js";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";

export default class GuildDeleteEvent extends Event {
	constructor() {
		super("guildDelete");
	}

	async run(client: Bot, guild: Guild) {
		await client.database.deleteGuild(guild.id);

		const owner = client.users.cache.get("852921856800718908") as User;
		const guildOwner = await guild.fetchOwner();

		const embed = new EmbedBuilder()
			.setColor(Util.resolveColor("Blurple"))
			.setTitle("😔 Server Deleted 😔")
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
