import { Guild } from "discord.js";
import { GuildData } from "../interfaces/Guild";
import Bot from "./Bot";

export = class DBManager {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	getGuild(guild: Guild): GuildData {
		var data = this.client.settings.has(`server-${guild.id}`);
		if (!data) this.createGuild(guild);

		return this.client.settings.fetch(`server-${guild.id}`);
	}

	createGuild(guild: Guild): GuildData {
		this.client.settings.set(`server-${guild.id}`, {
			prefix: "-",
			language: "en-US",

			starboardChannel: "0",
			welcomeChannel: "0",
			byeChannel: "0",
			logChannel: "0",
			levelsChannel: "0",

			autoRole: "0",
			muteRole: "0",

			antilink: "0",
			antispam: "0",
			antiinvite: "0",

			djRoles: [],
			immunityUsers: [],

			welcomeText: {
				en: "Welcome, {user_mention}!\nServer is now including **{members} members**!",
				ru: "Добро пожаловать, {user_mention}!\nСервер включает в себя **{members}** участников!",
			},

			byeText: {
				en: "{user_mention} left this server!\nServer is now including **{members} members**!",
				ru: "{user_mention} покинул данный сервер!\nСервер включает в себя **{members}** участников!",
			},

			twitchEnabled: "0",
			twitchChannelID: "0",
			twitchStreamers: [],
		});

		return this.client.settings.fetch(`server-${guild.id}`);
	}

	deleteGuild(guild: Guild | string) {
		const guildData = this.client.settings.has(
			`server-${guild instanceof Guild ? guild.id : guild}`
		);

		if (guildData) {
			this.client.settings.delete(
				`server-${guild instanceof Guild ? guild.id : guild}`
			);
		}

		return true;
	}

	getSetting<K extends keyof GuildData>(guild: Guild, key: K): GuildData[K] {
		var _data = this.client.settings.has(`server-${guild.id}`);
		if (!_data) this.createGuild(guild);

		const data: GuildData = this.getGuild(guild);
		const value = data[key];

		if (value === undefined) return;
		else return value;
	}

	getSettings(guild: Guild): GuildData {
		var _data = this.client.settings.has(`server-${guild.id}`);
		if (!_data) this.createGuild(guild);

		const data: GuildData = this.getGuild(guild);
		return data;
	}

	set(guild: Guild, key: string, value: any): boolean {
		var _data = this.client.settings.has(`server-${guild.id}`);
		if (!_data) this.createGuild(guild);

		const data = this.getGuild(guild);

		data[key] = value;
		this.client.settings.set(`server-${guild.id}`, data);

		return true;
	}
};
