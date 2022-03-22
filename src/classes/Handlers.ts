import Event from "../types/Event/Event";
import Bot from "./Bot";
import path from "path";

// Storage
import { promisify } from "util";
import glob_events from "glob";
import glob_cmds from "glob";

const glob = promisify(glob_events);

// Other
import { SlashCommand } from "../types/Command/SlashCommand";
import { Command } from "../types/Command/Command";
import { resolve } from "path";

type Structures = Command | SlashCommand;

export = class Handlers {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	async loadEvents() {
		const eventFiles: string[] = await glob(`./events/**/*.{js,ts}`);

		for (const file of eventFiles) {
			if (file.includes("twitchLive")) continue;
			if (file.includes("distubeEvents")) continue;

			const EventFile = await import(`../${file}`);

			const File: Event = new EventFile.default();

			this.client.events.set(File.getName(), File);
			(File.getEmitter() || this.client).on(
				File.getName(),
				async (...args) => File.run(this.client, ...args)
			);
		}
	}

	async loadCommands() {
		const files = glob_cmds.sync("./commands/**/*.{js,ts}");

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
		const files = glob_cmds.sync("./slash-commands/**/*.{js,ts}");

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

	async resolveFile<T>(file: string, client: Bot): Promise<T | null> {
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
