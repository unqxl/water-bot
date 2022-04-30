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
}

export { EnglishLocale };
