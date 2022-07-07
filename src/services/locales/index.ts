import { PermissionsString } from "discord.js";
import EnglishLocale from "./en-US.json";

export interface LocaleTemplate {
	ERRORS: {
		// Permissions Errors
		BOT_MISSING_PERMISSIONS: string;
		USER_MISSING_PERMISSIONS: string;
		NO_ACCESS: string;

		// Voice Errors
		JOIN_VOICE: string;
		JOIN_BOT_VOICE: string;

		// Music Errors
		QUEUE_IS_EMPTY: string;
		MUSIC_IS_PAUSED: string;
		MUSIC_IS_RESUMED: string;

		// Economy Errors
		NOT_ENOUGH_MONEY: string;
		TIME_ERROR: string;

		// Other Errors
		USER_IS_BOT: string;
		DATA_NOT_FOUND: string;
		NOT_IN_LIST: string;
		ALREADY_IN_LIST: string;
		ALREADY_HAS_EXPERIMENT: string;
		EXPERIMENT_NOT_FOUND: string;
		NO_GUILD: string;
		IN_EXPERIMENT_MODE: string;

		// Moderation Errors
		CANNOT_MODERATE_YOURSELF: string;
		CANNOT_MODERATE_BOT: string;

		// Games Errors
		PLAYER_NOT_FOUND: string;
		PROFILE_ERROR: string;
	};

	EVENTS: {};

	PERMISSIONS: Record<PermissionsString, string>;

	// Commands
	MODERATION_COMMANDS: {
		BAN: {
			TEXT: string;
		};

		KICK: {
			TEXT: string;
		};

		TIMEOUT: {
			TEXT: string;
		};
	};

	MUSIC_COMMANDS: {
		NOWPLAYING: {
			TITLE: string;
			NAME: string;
			DURATION: string;
			REQUESTEDBY: string;
		};

		PAUSE: {
			TEXT: string;
		};

		REPEAT: {
			QUEUE_MODE: string;
			SONG_MODE: string;
			DISABLED: string;
			TEXT: string;
		};

		RESUME: {
			TEXT: string;
		};

		SHUFFLE: {
			TEXT: string;
		};

		SKIP: {
			TEXT: string;
		};

		STOP: {
			TEXT: string;
		};

		VOLUME: {
			CURRENT: string;
			TEXT: string;
		};
	};

	ECONOMY_COMMANDS: {
		BALANCE_ADD: {
			TEXT: string;
		};

		BALANCE_SUBT: {
			TEXT: string;
		};

		BALANCE_GET: {
			TEXT: string;
		};

		BANK_DEPOSIT: {
			TEXT: string;
		};

		BANK_WITHDRAW: {
			TEXT: string;
		};

		DAILY: {
			TEXT: string;
		};

		WEEKLY: {
			TEXT: string;
		};

		WORK: {
			TEXT: string;
		};
	};

	// Games Commands
	GAMES_COMMANDS: {
		VALORANT: {
			MATCHES: string;
			REGION: string;
			LEVEL: string;
			RANK: string;
			ELO: string;
			PLACEMENT: string;
			WINS: string;
			PLAYED: string;
		};
	};

	// Other Commands
	OTHER_COMMANDS: {
		BOTINFO: {
			BOT_GUILDS: string;
			BOT_USERS: string;
			BOT_CHANNELS: string;
			BOT_PING: string;
			BOT_COMMANDS: string;
			BOT_VERSION: string;
			BOT_CREATED: string;
			BOT_STARTED: string;
		};

		COVID: {
			TOTAL: string;
			TODAY: string;
			CASES: string;
			RECOVERED: string;
			DEATHS: string;
			POPULATION: string;
			CRITICAL: string;
			LAST_UPDATE: string;
		};

		HELP: {
			ECONOMY_DESCRIPTION: string;
			GAMES_DESCRIPTION: string;
			MODERATION_DESCRIPTION: string;
			MUSIC_DESCRIPTION: string;
			OTHER_DESCRIPTION: string;
			OWNER_DESCRIPTION: string;
			SETTINGS_DESCRIPTION: string;
		};

		IMDB: {
			DIRECTORS: string;
			WRITERS: string;
			STARS: string;
			COMPANIES: string;
			COUNTRIES: string;
			LANGUAGES: string;
			RATINGS: string;
			CONTENT_RATING: string;
			IMDB_RATING: string;
			LENGTH: string;
		};

		OSU: {
			STATISTICS: string;
			GRADES: string;
			OTHER_USERNAMES: string;

			LEVEL: string;
			ACCURACY: string;
			PP: string;
			RANKED_SCORE: string;
			PLAYCOUNT: string;
			MAX_COMBO: string;
			PLAYSTYLE: string;
			RANK: string;
			COUNTRY_RANK: string;
			COUNTRY: string;
			LAST_VISIT: string;

			SSH: string;
			SS: string;
			SH: string;
			S: string;
			A: string;
		};

		OSU_BEATMAP: {
			ARTIST: string;
			CREATOR: string;
			STATUS: string;
			TITLE: string;
			SUBMITTED_AT: string;
			LAST_UPDATED: string;
			TAGS: string;
			DIFFICULTIES: string;

			// Field Values
			MODE: string;
			STARS: string;
			DIFF_NAME: string;
			BPM: string;
			URL: string;
			AR: string;
			CS: string;
		};

		SERVERINFO: {
			// Field Names
			INFORMATION: string;
			PRESENCES: string;
			MEMBERS: string;
			CHANNELS: string;

			// Presences
			ONLINE: string;
			IDLE: string;
			DND: string;
			OFFLINE: string;

			// Members Types
			HUMANS: string;
			BOTS: string;

			// Channel Types
			TEXT: string;
			VOICE: string;
			CATEGORIES: string;
			NEWS: string;
			STAGE: string;

			// Other
			GUILD_ID: string;
			OWNER: string;
			MEMBER_COUNT: string;
			CREATED_AT: string;
		};

		STEAM: {
			// Fields
			ABOUT: string;
			LANGUAGES: string;
			PLATFORMS: string;
			CATEGORIES: string;
			GENRES: string;
			RECOMMENDATIONS: string;
			RELEASE_DATE: string;
			FIELD_PRICE: string;
			NOTES: string;

			// Platforms
			WINDOWS: string;
			MAC: string;
			LINUX: string;

			// Other
			COMING_SOON: string;
			DATE: string;
			PRICE: string;
			DISCOUNT: string;
		};

		USERINFO: {
			// Buttons and their Titles
			INFORMATION_TITLE: string;
			INFORMATION_BTN: string;

			BADGES_TITLE: string;
			BADGES_BTN: string;

			// Fields
			ID: string;
			USERNAME: string;
			DISCRIMINATOR: string;
			AVATARS: string;
			BANNERS: string;
			STATUS: string;
			CREATED_AT: string;
			JOINED_AT: string;
			ROLES: string;
		};
	};

	OWNER_COMMANDS: {
		RELOAD: {
			COMMAND_RELOADED: string;
		};

		EXPERIMENTS: {
			GRANTED: string;
			REVOKED: string;
		};
	};

	SETTINGS_COMMANDS: {
		CONFIG: {
			AUTO_ROLE: string;
			MUTE_ROLE: string;
			TWITCH_CHANNEL: string;
			MEMBERS_CHANNEL: string;
			LOG_CHANNEL: string;
			PREFIX: string;
			TWITCH_SYSTEM: string;
		};

		TEXT_CHANGES: {
			WELCOME_LABEL: string;
			WELCOME_CHANGED: string;
			BYE_LABEL: string;
			BYE_CHANGED: string;
		};

		RESET_PROMPT: string;
		EDIT_TEXT: string;
		ENABLE_TEXT: string;
		DISABLE_TEXT: string;
		ADD_TEXT: string;
		REMOVE_TEXT: string;
		RESET_TEXT: string;
	};

	// Other
	ECONOMY_ACTIONS: {
		DEPOSIT: string;
		WITHDROW: string;
	};

	OTHER: {
		NONE: string;
		NOTHING: string;
		YES: string;
		NO: string;
	};

	BADGES: {
		BotHTTPInteraction: string;
		BugHunterLevel1: string;
		BugHunterLevel2: string;
		CertifiedModerator: string;
		Hypesquad: string;
		HypeSquadOnlineHouse1: string;
		HypeSquadOnlineHouse2: string;
		HypeSquadOnlineHouse3: string;
		Partner: string;
		PremiumEarlySupporter: string;
		Spammer: string;
		Staff: string;
		TeamPseudoUser: string;
		VerifiedBot: string;
		VerifiedDeveloper: string;
	};

	// Systems
	TWITCH_SYSTEM: {
		STREAM_STARTED: string;
		STREAM_TITLE: string;
		VIEWERS: string;
	};
}

export { EnglishLocale };
