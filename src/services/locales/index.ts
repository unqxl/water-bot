import { PermissionsString } from "discord.js";
import EnglishLocale from "./en-US.json";

export interface LocaleTemplate {
	ERRORS: {
		// Permissions Errors
		BOT_MISSING_PERMISSIONS: string;
		USER_MISSING_PERMISSIONS: string;

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
	};
	EVENTS: {};
	PERMISSIONS: Record<PermissionsString, string>;

	// Commands
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
	};

	// Other
	ECONOMY_ACTIONS: {
		DEPOSIT: string;
		WITHDROW: string;
	};
}

export { EnglishLocale };
