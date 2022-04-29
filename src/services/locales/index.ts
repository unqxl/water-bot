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
	};
	EVENTS: {};
	PERMISSIONS: Record<PermissionsString, string>;

	// Commands
	MUSIC_COMMANDS: {
		//? Now Playing Command
		NOWPLAYING_TITLE: string;
		NOWPLAYING_NAME: string;
		NOWPLAYING_DURATION: string;
		NOWPLAYING_REQUESTEDBY: string;
	};
}

export { EnglishLocale };
