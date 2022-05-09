import { GuildMember } from "discord.js";

export interface GuildData {
	id: string;
	locale: SupportedLocales;

	//? [Roles]
	auto_role: string | string[];
	mute_role: string;

	//? [Channels]
	members_channel: string;
	twitch_channel: string;
	log_channel: string;

	//? [Other]
	twitch_system: boolean;
	clans: GuildClan[];
	commands: GuildCustomCommand[];
	streamers: GuildTwitchStreamer[];
}

export type SupportedLocales = "en-US" | "ru-RU" | "uk-UA";

export interface GuildCustomCommand {
	name: string;
	response: string;
}

export interface GuildClan {
	name: string;
	members: string[];
}

export interface GuildTwitchStreamer {
	name: string;
	last_stream: string;
}
