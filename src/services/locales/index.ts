import { PermissionsString } from "discord.js";
import EnglishLocale from "./en-US";

export interface LocaleTemplate {
	ERRORS: {};
	EVENTS: {};
	PERMISSIONS: Record<PermissionsString, string>;
	COMMANDS: {};
}

export { EnglishLocale };
