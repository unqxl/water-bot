import { PermissionsString } from "discord.js";
import EnglishLocale from "./en-US.json";

export interface LocaleTemplate {
	ERRORS: {};
	EVENTS: {};
	PERMISSIONS: Record<PermissionsString, string>;
	COMMANDS: {};
}

export { EnglishLocale };
