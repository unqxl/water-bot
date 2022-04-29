import Event from "../types/Event/Event";
import Bot from "./Bot";
import path from "path";

// Storage
import { promisify } from "util";
import glob_events from "glob";
import glob_cmds from "glob";

const glob = promisify(glob_events);

// Other
import {
	ApplicationCommandData,
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from "discord.js";
import { SlashCommand } from "../types/Command/SlashCommand";
import { SubCommand } from "../types/Command/SubCommand";
import { Command } from "../types/Command/Command";
import { resolve } from "path";

type Structures = Command | SlashCommand | SubCommand;

export = class Handlers {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;

		this.createSlashCommand = this.createSlashCommand.bind(this);
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
		const files = glob_cmds.sync("./slash-commands/**/*.{js,ts}");
		const subCommands: Record<string, SubCommand[]> = {};
		const commandGroups: Record<string, [string, SubCommand[]]> = {};

		for (const file of files) {
			delete require.cache[file];

			const command = await this.resolveFile<SlashCommand | SubCommand>(
				file,
				this.client
			);
			if (!command) continue;
			await this.validateFile(file, command);

			let commandName;
			if (command instanceof SubCommand) {
				const groupName = command.options.groupName;
				const topLevelName = command.options.commandName;
				if (groupName) {
					const prev = commandGroups[groupName]?.[1] ?? [];

					commandGroups[groupName] = [
						topLevelName,
						[...prev, command],
					];
					commandName = `${topLevelName}-${groupName}-${command.name}`;
				} else if (topLevelName) {
					const prevSubCommands = subCommands[topLevelName] ?? [];
					subCommands[topLevelName] = [...prevSubCommands, command];
					commandName = `${topLevelName}-${command.name}`;
				}
			} else {
				commandName = command.name;

				const data: ApplicationCommandData = {
					type: ApplicationCommandType.ChatInput,
					name: command.name,
					description:
						command.options.description ?? "No description...",
					options: command.options.options ?? [],
				};

				await this.createSlashCommand(data);
			}

			this.client.slashCommands.set(commandName, command);
		}

		for (const topLevelName in subCommands) {
			const cmds = subCommands[topLevelName];
			const data: ApplicationCommandData = {
				type: ApplicationCommandType.ChatInput,
				name: topLevelName,
				description: `${topLevelName} Commands...`,
				// @ts-expect-error ignore
				options: cmds.map((v) => v.options),
			};

			await this.createSlashCommand(data);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const groupCache: any[] = [];

		for (const groupName in commandGroups) {
			const [topLevelName, cmds] = commandGroups[groupName];

			const groupData = {
				type: ApplicationCommandOptionType.SubcommandGroup,
				name: groupName,
				description: `${groupName} Sub Commands...`,
				options: cmds.map((v) => v.options),
			};

			groupCache.push(groupData);

			const data: ApplicationCommandData = {
				type: ApplicationCommandType.ChatInput,
				name: topLevelName,
				description: `${topLevelName} Commands...`,
				options: [
					...groupCache,
					...subCommands[topLevelName].map((v) => v.options),
				],
			};

			await this.createSlashCommand(data);
		}
	}

	async createSlashCommand(data: ApplicationCommandData) {
		await this.client.application?.commands.create(data).catch(console.log);
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
