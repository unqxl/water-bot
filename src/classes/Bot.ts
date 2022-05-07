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
import WebServer from "./Server";
import Enmap from "enmap";
import DisTube from "distube";
import logs from "discord-logs";

// Other
import NekoClient from "nekos.life";
import Functions from "./Functions";
import Handlers from "./Handlers";
import Logger from "./Logger";
import TopGG from "../modules/TopGG";
import config from "../cfg";

// Distube Plugins
import { YtDlpPlugin } from "@distube/yt-dlp";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";

// Interfaces and Structures
import { SlashCommand } from "../types/Command/SlashCommand";
import { SubCommand } from "../types/Command/SubCommand";
import { GuildData } from "../interfaces/Guild";
import Event from "../types/Event/Event";

// WebSocket
import API from "./API";

export = class Bot extends Client {
	//? [Collections]
	public commands: Collection<string, SlashCommand | SubCommand> =
		new Collection();
	public aliases: Collection<string, string> = new Collection();
	public events: Collection<string, Event> = new Collection();

	//? [Other]
	public owners: string[] = ["852921856800718908"];
	public config: typeof config = config;
	public twitchKey: string;
	public version: string = "2.3.0-dev";

	//? [Storages]
	public configurations: Enmap<string, GuildData> = new Enmap({
		name: "configurations",
		dataDir: "./db",
		wal: false,
	}); //? Configurations Storage

	public leveling = new Enmap({
		name: "leveling",
		dataDir: "./db",
		wal: false,
	}); //? Leveling Storage

	//? [APIs]
	public dagpi: dagpiClient = new dagpiClient(this.config.keys.dagpi_key);
	public nekos: NekoClient = new NekoClient();
	public imdb: IMDBClient = new IMDBClient({
		apiKey: this.config.keys.imdb_key,
	});
	// @ts-expect-error ignore
	public together: DiscordTogether = new DiscordTogether(this);

	public handlers: Handlers = new Handlers(this);
	public functions: Functions = new Functions(this);

	//? [Systems]
	public apis: API = new API(this.config);
	public web: WebServer = new WebServer({ port: 80 });
	public logger: Logger = new Logger();

	//? [Modules]
	// @ts-expect-error ignore
	public moderation: Moderation = new Moderation(this, {
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

	public economy: Economy = new Economy({
		DBName: "economy",
		DBPath: "./db/",
		rewards: {
			daily: 150,
			weekly: 1050,
			work: [100, 150],
		},
	});

	public music: DisTube = new DisTube(this, {
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

		ytdlOptions: {
			highWaterMark: 1024 * 1024 * 64,
			quality: "highestaudio",
			liveBuffer: 60000,
			dlChunkSize: 1024 * 1024 * 64,
		},
	});

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

		this.music.setMaxListeners(Infinity);
		this.setMaxListeners(Infinity);
	}

	async start() {
		if (!this.application?.owner) await this.application?.fetch();

		await logs(this);
		await this.handlers.loadEvents();
		await this.functions.updateToken();

		new TopGG(this);

		this.config.bot.test
			? this.login(this.config.bot.testToken)
			: this.login(this.config.bot.token);
	}

	async wait(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}
};
