import { Guild, MessageEmbed, User } from "discord.js";
import { RunFunction } from "../../interfaces/Event";

export const name: string = "guildDelete";

export const run: RunFunction = async (client, guild: Guild) => {
	await client.database.deleteGuild(guild);
	const owner = client.users.cache.get("852921856800718908") as User;
	const guildOwner = await guild.fetchOwner();

	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setTitle("😔 Deleted Server 😔")
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
};
