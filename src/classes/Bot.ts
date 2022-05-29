import {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
	ActivityType,
	Util,
} from "discord.js";
import { Moderation } from "discord-moderation";
import { Client as dagpiClient } from "dagpijs";
import { DiscordTogether } from "discord-together";
import { Client as IMDBClient } from "imdb-api";
import { Economy } from "@badboy-discord/discordjs-economy";
import Enmap from "enmap";
import DisTube from "distube";
import logs from "discord-logs";

// Other
import NekoClient from "nekos.life";
import Functions from "./Functions";
import Handlers from "./Handlers";
import Logger from "./Logger";
import config from "../cfg";

// Distube Plugins
import { YtDlpPlugin } from "@distube/yt-dlp";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";

// Interfaces and Structures
import { SlashCommand } from "../types/Command/SlashCommand";
import { SubCommand } from "../types/Command/SubCommand";
import { GuildData } from "../types/Guild";
import Event from "../types/Event/Event";

// WebSocket
import API from "./API";

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
						type: ActivityType.Listening,
						name: "music 🎶",
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
		this.version = "2.3.0-dev";

		this.configurations = new Enmap({
			name: "configurations",
			dataDir: "./db",
			wal: false,
		});

		this.dagpi = new dagpiClient(this.config.keys.dagpi_key);
		this.nekos = new NekoClient();
		this.imdb = new IMDBClient({
			apiKey: this.config.keys.imdb_key,
		});
		// @ts-expect-error ignore
		this.together = new DiscordTogether(this);

		this.handlers = new Handlers(this);
		this.functions = new Functions(this);
		this.apis = new API(this.config);
		this.logger = new Logger();

		// @ts-expect-error ignore
		this.moderation = new Moderation(this, {
			dbPath: "./db/",
			locale: "en-US",

			systems: {
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

			plugins: [
				new SpotifyPlugin(),
				new SoundCloudPlugin(),
				new YtDlpPlugin(),
			],
		});

		this.music.setMaxListeners(Infinity);
		this.setMaxListeners(Infinity);
	}

	async start() {
		await logs(this);
		await this.handlers.loadEvents();
		await this.functions.updateToken();

		this.config.bot.test
			? this.login(this.config.bot.testToken)
			: this.login(this.config.bot.token);
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

		//? APIs
		dagpi: dagpiClient;
		nekos: NekoClient;
		imdb: IMDBClient;
		together: DiscordTogether<{}>;

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
