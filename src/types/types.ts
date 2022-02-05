export type CustomCommand = {
	name: string;
	response: string;
};

export type Streamer = {
	name: string;
	latestStream: string;
};

export type GuildConfig = {
	djRoles: string[];
	twitchSystem: boolean;
	twitchStreamers: Streamer[];
};
