import { Guild } from "discord.js";
import { bold } from "@discordjs/builders";
import { Job } from "../../plugins/Job";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";
import { GuildService } from "../../services/Guild";

export default class ReadyEvent extends Event {
	constructor() {
		super("ready");
	}

	async run(client: Bot) {
		if (!client.application.owner) await client.application.fetch();
		client.application.commands.set([]);

		await client.web.start();
		await client.handlers.loadCommands();
		await checkUp(client);

		console.log(`${client.user.username} logged in!`);

		const job = new Job(
			client,
			"Twitch Token Update",
			"0 10 0 * * *",
			async () => {
				await client.functions.updateToken();
			},
			null,
			true,
			"Europe/Moscow"
		);

		job.start();
	}
}

async function checkUp(client: Bot) {
	const service = new GuildService(client);

	const guildIDS = [];
	for (const id of client.guilds.cache.keys()) {
		guildIDS.push(id);
	}

	for (const guildID of guildIDS) {
		const guild = client.guilds.cache.get(guildID);

		if (!guild) service.delete(guildID);
		else await service.getSettings(guild.id);
	}

	return true;
}
