import { GuildService } from "../../services/Guild";
import { Job } from "../../plugins/Job";
import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import { ApplicationCommandOptionType } from "discord.js";

export default class ReadyEvent extends Event {
	constructor() {
		super("ready");
	}

	async run(client: Bot) {
		if (!client.application.owner) await client.application.fetch();

		console.log("# Deleting Slash Commands");
		for (const command of client.application.commands.cache.values()) {
			command.delete();
		}
		console.log("# Finished\n");

		await client.web.start();
		await client.handlers.loadCommands();
		await checkUp(client);

		console.log("\n# Checking Slash Commands");
		for (const command of client.application.commands.cache.values()) {
			for (var option of command.options.values()) {
				var name = "";

				if (
					option.type === ApplicationCommandOptionType.SubcommandGroup
				) {
					for (const subcommand of option.options.values()) {
						name = `${command.name}-${option.name}-${subcommand.name}`;

						const data = this.client.commands.get(name);
						if (!data) {
							option.options = option.options.filter(
								(x) => x.name !== subcommand.name
							);

							command.edit(command);
						}
					}
				}
				if (option.type === ApplicationCommandOptionType.Subcommand) {
					name = `${command.name}-${option.name}`;

					const data = this.client.commands.get(name);
					if (!data) {
						option.options = option.options.filter(
							(x) => x.name !== option.name
						);

						command.edit(command);
					}
				}
			}
		}
		console.log("# Finished\n");

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
