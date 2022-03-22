import "reflect-metadata";

import {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
	ActivityType,
	Util,
} from "discord.js";
import { EnmapGiveaways } from "./EnmapGiveaways";
import { Moderation } from "discord-moderation";
import { Leveling } from "./Leveling";
import { Client as dagpiClient } from "dagpijs";
import { DiscordTogether } from "discord-together";
import { Client as IMDBClient } from "imdb-api";
import { Economy } from "@badboy-discord/discordjs-economy";
import Cluster, { Client as ClusterClient } from "discord-hybrid-sharding";
import WebServer from "./Server";
import Enmap from "enmap";
import DisTube from "distube";
import logs from "discord-logs";

// Other
import DBManager from "./DBManager";
import Handlers from "./Handlers";
import Functions from "./Functions";
import config from "../config";
import TwitchSystem from "../modules/TwitchSystem";
import Logger from "./Logger";
import TopGG from "../modules/TopGG";
import DJSystem from "../modules/DJSystem";
import distubeEvents from "../events/distubeEvents";
import NekoClient from "nekos.life";
import ClanSystem from "../modules/ClanSystem";

// Distube Plugins
import { YtDlpPlugin } from "@distube/yt-dlp";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";

// Interfaces and Structures
import { CustomCommand, GuildConfig } from "../types/types";
import { SlashCommand } from "../types/Command/SlashCommand";
import { ClansGuild } from "../interfaces/Clans";
import { Command } from "../types/Command/Command";
import Event from "../types/Event/Event";

// MySQL
import { createConnection, getRepository } from "typeorm";
import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";

// WebSocket
import { io, Socket } from "socket.io-client";
import API from "./API";

export = class Bot extends Client {
	//? [Collections]
	public commands: Collection<string, Command> = new Collection();
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public aliases: Collection<string, string> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public _configs: Collection<string, GuildConfiguration> = new Collection();

	//? [Other]
	public owners: string[] = ["852921856800718908"];
	public config: typeof config = config;
	public twitchKey: string = "";
	public version: string = "2.2.0-dev";

	//? [Storages]
	public custom_commands: Enmap<string, CustomCommand[]> = new Enmap({
		name: "custom_commands",
		dataDir: "./db",
		wal: false,
	}); //? Custom Commands Storage

	public configurations: Enmap<string, GuildConfig> = new Enmap({
		name: "configurations",
		dataDir: "./db",
		wal: false,
	}); //? Configurations Storage

	public leveling = new Enmap({
		name: "leveling",
		dataDir: "./db",
		wal: false,
	}); //? Leveling Storage

	public giveawaysDB = new Enmap({
		name: "giveaways",
		dataDir: "./db",
		wal: false,
	}); //? Giveaways Storage

	public clansDB: Enmap<string, ClansGuild> = new Enmap({
		name: "clans",
		dataDir: "./db",
		wal: false,
	}); //? Clans Storage

	//? [APIs]
	public dagpi: dagpiClient = new dagpiClient(this.config.keys.dagpi_key);
	public nekos: NekoClient = new NekoClient();
	public imdb: IMDBClient = new IMDBClient({
		apiKey: this.config.keys.imdb_key,
	});
	// @ts-expect-error
	public together: DiscordTogether<{}> = new DiscordTogether(this);

	public handlers: Handlers = new Handlers(this);
	public functions: Functions = new Functions(this);

	//? [Systems]
	public cluster: ClusterClient = new ClusterClient(this);
	public apis: API = new API(this.config);
	public web: WebServer = new WebServer({ port: 80 });
	public socket: Socket = io("http://localhost:3001");
	public clans: ClanSystem = new ClanSystem(this);
	public DJSystem: DJSystem = new DJSystem(this);
	public levels: Leveling = new Leveling(this);
	public logger: Logger = new Logger();
	public twitchSystem: TwitchSystem = new TwitchSystem(this);
	public database: DBManager = null;

	//? [Modules]
	// @ts-expect-error
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

	public giveaways: EnmapGiveaways = new EnmapGiveaways(this, {
		endedGiveawaysLifetime: 60000 * 60 * 24,

		default: {
			botsCanWin: false,
			embedColor: Util.resolveColor("Blurple"),
			embedColorEnd: Util.resolveColor("Green"),
			reaction: "🎉",

			lastChance: {
				enabled: true,
				embedColor: Util.resolveColor("Yellow"),
				content: "Last Chance to Enter!",
			},
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
			],

			presence: {
				status: "idle",
				activities: [
					{
						type: ActivityType.Watching,
						name: "music 🎶",
					},
				],
			},

			shards: Cluster.data.SHARD_LIST,
			shardCount: Cluster.data.TOTAL_SHARDS,
		});

		this.music.setMaxListeners(100);
		this.setMaxListeners(100);
	}

	async start() {
		if (!this.application?.owner) await this.application?.fetch();

		//? [MySQL Setup - Start]
		await createConnection({
			name: "default",
			type: "mysql",
			host: this.config.mysql.host,
			port: 3306,
			username: this.config.mysql.username,
			password: this.config.mysql.password,
			database: this.config.mysql.database,
			entities: [GuildConfiguration],
		});

		const configRepo = getRepository(GuildConfiguration);
		const guildConfigs = await configRepo.find();
		const configMappings = new Collection<string, GuildConfiguration>();

		for (const config of guildConfigs) {
			configMappings.set(config.guild_id, config);
		}

		this.configs = configMappings;
		this.database = new DBManager(this);
		//? [MySQL Setup - End]

		await distubeEvents(this);
		await logs(this);
		await this.handlers.loadEvents();
		await this.handlers.loadCommands();
		await this.handlers.loadSlashCommands();
		await this.functions.updateToken();

		new TopGG(this);

		this.config.bot.test
			? this.login(this.config.bot.testToken)
			: this.login(this.config.bot.token);
	}

	async wait(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}

	get configs(): Collection<string, GuildConfiguration> {
		return this._configs;
	}

	set configs(guildConfigs: Collection<string, GuildConfiguration>) {
		this._configs = guildConfigs;
	}
};
