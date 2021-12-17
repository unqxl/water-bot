import { Event } from "../interfaces/Event";
import Goose from "./Goose";
import path from "path";

// Storage
import { promisify } from "util";
import glob_events from "glob";
import glob_cmds from "glob";

const glob = promisify(glob_events);

// Other
import { resolve } from "path";
import { Command } from "../structures/Command/Command";
import { SlashCommand } from "../structures/Command/SlashCommand";

type Structures = Command | SlashCommand;

export = class Handlers {
	public client: Goose;

	constructor(client: Goose) {
		this.client = client;
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	async loadEvents(client: Goose) {
		const eventFiles: string[] = await glob(
			process.env.BUILD_PATH ? `./events/**/*.js` : `./src/events/**/*.ts`
		);

		for (const file of eventFiles) {
			const evt: Event = await import(
				process.env.BUILD_PATH ? `../${file}` : `../../${file}`
			);

			client.events.set(evt.name, evt);
			(evt.emitter || client).on(evt.name, async (...args) =>
				evt.run(client, ...args)
			);
		}
	}

	async loadCommands() {
		const files = process.env.BUILD_PATH
			? glob_cmds.sync("./commands/**/*.js")
			: glob_cmds.sync("./src/commands/**/*.ts");

		for (const file of files) {
			delete require.cache[file];

			const command = await this.resolveFile<Command>(file, this.client);
			if (!command) continue;

			await this.validateFile(file, command);

			this.client.commands.set(command.name, command);

			if (command.options.aliases) {
				command.options.aliases.forEach((alias) =>
					this.client.aliases.set(alias, command.name)
				);
			}
		}
	}

	async loadSlashCommands() {
		const files = process.env.BUILD_PATH
			? glob_cmds.sync("./slash-commands/**/*.js")
			: glob_cmds.sync("./src/slash-commands/**/*.ts");

		for (const file of files) {
			delete require.cache[file];

			const command = await this.resolveFile<SlashCommand>(
				file,
				this.client
			);
			if (!command) continue;

			await this.validateFile(file, command);

			this.client.slashCommands.set(command.name, command);
		}
	}

	async resolveFile<T>(file: string, client: Goose): Promise<T | null> {
		const resolvedPath = resolve(file);
		const File = await (await import(resolvedPath)).default;

		if (!File?.constructor) return null;

		return new File(client) as T;
	}

	async validateFile(file: string, item: Structures) {
		const type = this.getType(item);

		if (!item.name) {
			throw new TypeError(
				`[ERROR][${type}]: name is required for ${type}! (${file})`
			);
		}

		if (!item.run) {
			throw new TypeError(
				`[ERROR][${type}]: execute function is required for ${type}! (${file})`
			);
		}
	}

	getType(item: Structures) {
		if (item instanceof Command) {
			return "COMMAND";
		}
	}
};
