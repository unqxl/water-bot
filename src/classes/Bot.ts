import {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
	ActivityType,
} from "discord.js";
import { Moderation } from "@djs-modules/moderation";
import { Economy } from "@djs-modules/economy";
import Enmap from "enmap";
import DisTube from "distube";
import logs from "discord-logs";

// APIs
import { Client as IMDBClient } from "imdb-api";

// Other
import Functions from "./Functions";
import Handlers from "./Handlers";
import Logger from "./Logger";
import config from "../cfg";
import API from "./API";

// Distube Plugins
import { YtDlpPlugin } from "@distube/yt-dlp";
import SoundCloudPlugin from "@distube/soundcloud";
import musicEvents from "../events/musicEvents";

// Interfaces and Structures
import { ExperimentOptions } from "../types/types";
import { SlashCommand } from "../types/Command/SlashCommand";
import { SubCommand } from "../types/Command/SubCommand";
import { GuildData } from "../types/Guild";
import Event from "../types/Event";

export = class Bot extends Client {
	constructor() {
		super({
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.Message,
				Partials.Reaction,
				Partials.User,
			],

			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.MessageContent,
			],

			presence: {
				status: "idle",
				activities: [
					{
						type: ActivityType.Watching,
						name: "released :pog:",
					},
				],
			},
		});

		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();

		this.owners = ["852921856800718908"];
		this.config = config;
		this.twitchKey = null;
		this.version = "2.3.1";

		this.configurations = new Enmap({
			name: "configurations",
			dataDir: "./db",
			wal: false,
		});

		this.experiments = new Enmap({
			name: "experiments",
			dataDir: "./db",
			wal: false,
		});

		this.imdb = new IMDBClient({
			apiKey: this.config.keys.imdb_key,
		});

		this.handlers = new Handlers(this);
		this.functions = new Functions(this);
		this.apis = new API(this.config);
		this.logger = new Logger();

		// @ts-ignore
		this.moderation = new Moderation(this, {
			dbPath: "./db/",
			locale: "en-US",

			defaultSystems: {
				ghostPing: true,
				antiInvite: true,
				antiJoin: true,
				antiLink: true,
				antiSpam: true,
				autoRole: false,
			},
		});

		this.economy = new Economy({
			DBName: "economy",
			DBPath: "./db/",
			rewards: {
				daily: 150,
				weekly: 1050,
				work: [100, 150],
			},
		});

		this.music = new DisTube(this, {
			leaveOnEmpty: true,
			leaveOnFinish: true,
			leaveOnStop: true,

			emitNewSongOnly: true,
			emitAddSongWhenCreatingQueue: false,
			emptyCooldown: 5,

			plugins: [new SoundCloudPlugin(), new YtDlpPlugin({ update: true })],
		});

		this.music.setMaxListeners(Infinity);
		this.setMaxListeners(Infinity);
	}

	async start() {
		await logs(this);
		await musicEvents(this);

		await this.handlers.loadEvents();
		await this.functions.updateToken();

		this.login(this.config.bot.token);

		// Every 10 minutes, update the token
		setInterval(() => {
			this.functions.updateToken();
		}, 600000);
	}

	async wait(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}
};

declare module "discord.js" {
	interface Client {
		//? Collections
		commands: Collection<string, SlashCommand | SubCommand>;
		aliases: Collection<string, string>;
		events: Collection<string, Event>;

		//? Other
		owners: string[];
		config: typeof config;
		twitchKey: string;
		version: string;

		//? Storages
		configurations: Enmap<string, GuildData>; //? Guild Configurations
		experiments: Enmap<string, ExperimentOptions[]>; //? Guild's Experminents

		//? APIs
		imdb: IMDBClient;

		//? Systems
		handlers: Handlers;
		functions: Functions;
		apis: API;
		logger: Logger;

		//? Modules
		moderation: Moderation;
		economy: Economy;
		music: DisTube;
	}
}
