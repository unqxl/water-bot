import { ApplicationCommandOptionType } from "discord.js";
import { GuildService } from "../../services/Guild";
import { Job } from "../../plugins/Job";
import Event from "../../types/Event";
import Bot from "../../classes/Bot";

export default class ReadyEvent extends Event {
	constructor() {
		super("ready");
	}

	async run(client: Bot) {
		if (!client.application.owner) await client.application.fetch();

		client.logger.log("Deleting slash commands...");
		for (const command of client.application.commands.cache.values()) {
			command.delete();
		}
		client.logger.log("Finished. \n");

		await client.handlers.loadCommands();
		await checkUp(client);

		client.logger.log("Started to checking created slash commmands...");
		var count = 0;
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

							count += 1;
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

						count += 1;
						command.edit(command);
					}
				}
			}
		}
		client.logger.log(`Finished, edited ${count} commands. \n`);

		client.logger.log(`${client.user.tag} is ready!`);

		new Job(
			client,
			"Twitch Token Update",
			"0 10 0 * * *",
			async () => {
				await client.functions.updateToken();
			},
			null,
			true,
			"Europe/Moscow"
		).start();
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

		service.checkAndMigrate(guildID);
	}

	return true;
}
