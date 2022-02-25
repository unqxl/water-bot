export interface ClansGuild {
	clans: GuildClan[];
}

export interface GuildClan {
	name: string;
	abr: string;
	owner: string;
	membersCount: number;
	members: string[];
}
