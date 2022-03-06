import { Job } from "../../plugins/Job";
import { Guild, Embed, TextChannel, Util } from "discord.js";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";
import deployCommands from "../../deploy-commands";

export default class ReadyEvent extends Event {
	constructor() {
		super("ready");
	}

	async run(client: Bot) {
		if (!client.application.owner) await client.application.fetch();

		await client.web.start();
		await deployCommands(client);
		await checkUp(client);

		console.log(`${client.user.username} logged in!`);

		const job = new Job(
			client,
			"Birthday Check",
			"0 10 0 * * *",
			async () => {
				for (const guild of client.guilds.cache.values()) {
					await birthdayCheck(client, guild);
					await client.twitchSystem.check(guild);
				}
			},
			null,
			true,
			"Europe/Moscow"
		);

		job.start();
	}
}

async function checkUp(client: Bot) {
	const guildIDS = [];
	for (const id of client.guilds.cache.keys()) {
		guildIDS.push(id);
	}

	for (const guildID of guildIDS) {
		const guild = client.guilds.cache.get(guildID);

		if (!guild) await client.database.deleteGuild(guildID);
		else await client.database.getGuild(guild.id);
	}

	return true;
}

async function birthdayCheck(client: Bot, guild: Guild) {
	const settings = await client.database.getSettings(guild.id);
	if (!settings.log_channel) return;

	const birthdayCheck = client.functions.checkGuildBirthday(guild);
	if (!birthdayCheck.status) return;

	const channel = guild.channels.cache.get(settings.log_channel);
	if (!channel) return;

	const lang_file = await client.functions.getLanguageFile(guild.id);

	const [years, year] = [
		lang_file.EVENTS.GUILD_BIRTHDAY.YEARS,
		lang_file.EVENTS.GUILD_BIRTHDAY.YEAR,
	];

	const description = lang_file.EVENTS.GUILD_BIRTHDAY.TEXT(
		Util.escapeMarkdown(guild.name),
		client.functions.sp(birthdayCheck.years),
		birthdayCheck.years > 1 ? years : year
	);

	const embed = new Embed()
		.setColor(Util.resolveColor("Blurple"))
		.setAuthor({
			name: guild.name,
			iconURL: guild.iconURL(),
		})
		.setDescription(bold(description))
		.setTimestamp();

	return (channel as TextChannel).send({
		embeds: [embed],
	});
}
