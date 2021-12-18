import { MessageEmbed, TextChannel, Util } from "discord.js";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";
import deployCommands from "../../deploy-commands";
import TopGG from "../../modules/TopGG";

export const name: string = "ready";

export const run: RunFunction = async (client) => {
	if (!client?.application.owner) await client.application.fetch();

	new TopGG(client);
	await checkUp(client);
	await deployCommands(client);

	console.log(`${client.user.username} logged in!`);

	setInterval(async () => {
		for (const [n, guild] of client.guilds.cache) {
			await client.twitchSystem.check(guild);
		}
	}, 30000);

	setInterval(async () => {
		await client.functions.updateToken();
	}, 600000);

	setInterval(async () => {
		for (const [n, guild] of client.guilds.cache) {
			const settings = client.database.getSettings(guild);
			if (settings.logChannel === "0") return;

			const birthdayCheck = client.functions.checkGuildBirthday(guild);
			if (!birthdayCheck.status) return;

			const channel = guild.channels.cache.get(settings.logChannel);
			if (!channel) return;

			const lang = await client.functions.getLanguageFile(guild);

			const [more, notMore] = [
				lang.EVENTS.GUILD_BIRTHDAY.YEARS,
				lang.EVENTS.GUILD_BIRTHDAY.YEAR,
			];

			const description = lang.EVENTS.GUILD_BIRTHDAY.text
				.replace("{name}", Util.escapeMarkdown(guild.name))
				.replace("{years}", client.functions.sp(birthdayCheck.years))
				.replace("{check}", birthdayCheck.years > 1 ? more : notMore);

			const embed = new MessageEmbed()
				.setColor("BLURPLE")
				.setAuthor(guild.name, guild.iconURL({ dynamic: true }))
				.setDescription(`🎉 | ${bold(description)}`)
				.setTimestamp();

			return (channel as TextChannel).send({
				embeds: [embed],
			});
		}
	}, 3600000);
};

async function checkUp(client: Goose) {
	const settingsOBJ = client.settings.keys();
	const guildIDS: string[] = [];

	for (const name of settingsOBJ) {
		const guildID = name.toString().slice("server-".length);
		guildIDS.push(guildID);
	}

	for (const guildID of guildIDS) {
		const guild = client.guilds.cache.get(guildID);

		if (!guild) await client.database.deleteGuild(guildID);
		else await client.database.getGuild(guild);
	}

	return true;
}
