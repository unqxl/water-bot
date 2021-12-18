import { Client, Collection } from "discord.js";
import { EnmapGiveaways } from "./EnmapGiveaways";
import { Moderation } from "discord-moderation";
import { Leveling } from "./Leveling";
import { Client as dagpiClient } from "dagpijs";
import { DiscordTogether } from "discord-together";
import DJSystem from "../modules/DJSystem";
import TopGG from "../modules/TopGG";
import Economy from "discord-economy-super";
import Enmap from "enmap";
import DisTube from "distube";
import logs from "discord-logs";

// Other
import Handlers from "./Handlers";
import DBManager from "./DBManager";
import Functions from "./Functions";
import config from "../config";
import TwitchSystem from "../handlers/TwitchSystem";
import Logger from "./Logger";

// Music Plugins
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";

// Interfaces and Structures
import { Event } from "../interfaces/Event";
import { Command } from "../types/Command/Command";
import { SlashCommand } from "types/Command/SlashCommand";

class Goose extends Client {
	// Collections
	public commands: Collection<string, Command> = new Collection();
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public aliases: Collection<string, string> = new Collection();
	public events: Collection<string, Event> = new Collection();

	// Other
	public owners: string[] = ["852921856800718908"];
	public config: typeof config = config;
	public twitchKey: string = "";
	public version: string = "2.1.2";

	// Databases
	public settings = new Enmap({
		name: "settings",
		dataDir: process.env.BUILD_PATH ? "./db" : "./src/db",
		wal: false,
	}); // Guild Settings Database

	public giveawaysDB = new Enmap({
		name: "giveaways",
		dataDir: process.env.BUILD_PATH ? "./db" : "./src/db",
		wal: false,
	}); // Giveaways Database

	public leveling = new Enmap({
		name: "leveling",
		dataDir: process.env.BUILD_PATH ? "./db" : "./src/db",
		wal: false,
	}); // Leveling Database

	// Classes
	public handlers: Handlers = new Handlers(this);
	public functions: Functions = new Functions(this);
	public database: DBManager = new DBManager(this);
	public logger: Logger = new Logger();
	public twitchSystem: TwitchSystem = new TwitchSystem(this);
	public levels: Leveling = new Leveling(this);
	public dagpi: dagpiClient = new dagpiClient(this.config.keys.dagpi_key);
	public together: DiscordTogether<{}> = new DiscordTogether(this);
	
	// Additional Systems
	public DJSystem: DJSystem = new DJSystem(this);

	// Modules
	public moderation: Moderation = new Moderation(this, {
		dbPath: process.env.BUILD_PATH ? "./db/" : "./src/db/",
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
		storagePath: process.env.BUILD_PATH
			? "./db/economy.json"
			: "./src/db/economy.json",

		dailyCooldown: 60000 * 60 * 24,
		workCooldown: 60000 * 60,
		weeklyCooldown: 60000 * 60 * 24 * 7,

		dailyAmount: 150,
		workAmount: [25, 75],
		weeklyAmount: 1050,

		subtractOnBuy: true,
		dateLocale: "en-US",

		updater: {
			checkUpdates: false,
			upToDateMessage: false,
		},

		savePurchasesHistory: false,
	});

	public music: DisTube = new DisTube(this, {
		leaveOnEmpty: true,
		leaveOnFinish: true,
		leaveOnStop: true,

		emitNewSongOnly: true,
		emitAddSongWhenCreatingQueue: false,
		emptyCooldown: 5,

		plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],

		ytdlOptions: {
			highWaterMark: 1024 * 1024 * 64,
			quality: "highestaudio",
			liveBuffer: 60000,
			dlChunkSize: 1024 * 1024 * 64,
		},

		youtubeDL: true,
		updateYouTubeDL: true,
	});

	public giveaways: EnmapGiveaways = new EnmapGiveaways(this, {
		endedGiveawaysLifetime: 60000 * 60 * 24,

		default: {
			botsCanWin: false,
			embedColor: "BLURPLE",
			embedColorEnd: "GREEN",
			reaction: "🎉",

			lastChance: {
				enabled: true,
				embedColor: "YELLOW",
				content: "Last Chance to Enter!",
			},
		},
	});

	constructor() {
		super({
			partials: [
				"CHANNEL",
				"GUILD_MEMBER",
				"MESSAGE",
				"REACTION",
				"USER",
			],

			intents: [
				"GUILDS",
				"GUILD_MEMBERS",
				"GUILD_MESSAGES",
				"GUILD_VOICE_STATES",
				"GUILD_BANS",
				"GUILD_EMOJIS_AND_STICKERS",
				"GUILD_MESSAGE_REACTIONS",
				"GUILD_PRESENCES",
			],

			presence: {
				status: "idle",
				activities: [
					{
						type: "LISTENING",
						name: "music 🎶",
					},
				],
			},
		});

		this.music.setMaxListeners(100);
		this.setMaxListeners(100);
	}

	async start() {
		if (!this.application?.owner) await this.application?.fetch();

		await logs(this);
		await this.handlers.loadEvents(this);
		await this.handlers.loadCommands();
		await this.handlers.loadSlashCommands();
		await this.functions.updateToken();

		if (this.config.bot.test) this.login(this.config.bot.testToken);
		else this.login(this.config.bot.token);
	}

	async wait(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}
}

export = Goose;
