import { GuildData } from "../types/Guild";
import Bot from "../classes/Bot";

export class GuildService {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	create(id: string): GuildData {
		var data = this.client.configurations.get(id);
		if (data) return data;

		this.client.configurations.set(id, {
			id: id,
			locale: "en-US",
			auto_role: null,
			mute_role: null,
			members_channel: null,
			twitch_channel: null,
			log_channel: null,
			twitch_system: false,
			clans: [],
			commands: [],
			streamers: [],
		});

		return this.client.configurations.get(id);
	}

	delete(id: string): boolean {
		var data = this.client.configurations.get(id);
		if (!data) return false;

		this.client.configurations.delete(id);
		return true;
	}

	getSettings(id: string): GuildData {
		const data = this.create(id);
		return data;
	}

	getSetting<K extends keyof GuildData>(id: string, key: K): GuildData[K] {
		const data = this.create(id);
		return data[key];
	}

	set<K extends keyof GuildData>(
		id: string,
		key: K,
		value: GuildData[K]
	): GuildData {
		const data = this.create(id);
		data[key] = value;

		this.client.configurations.set(id, data);
		return data;
	}
}
