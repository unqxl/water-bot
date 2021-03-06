import { GuildData } from "../types/Guild";
import Bot from "../classes/Bot";

export class GuildService {
	public client: Bot;
	public defaultValue: GuildData;

	constructor(client: Bot) {
		this.client = client;
		this.defaultValue = {
			id: null,
			locale: "en-US",
			auto_role: null,
			mute_role: null,
			members_channel: null,
			twitch_channel: null,
			log_channel: null,
			twitch_system: false,
			texts: {
				welcome:
					"%s (%s1) is joined this server!\nThere's %s2 members in this server now!\nEnjoy your stay!",
				goodbye:
					"%s (%s1) left this server!\nThere's %s2 members in this server now!",
				boost:
					"%s (%s1) just boosted this server!\nThere's %s2 boosters in this server now!",
			},
			commands: [],
			streamers: [],
		};
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
			texts: {
				welcome:
					"%s (%s1) is joined this server!\nThere's %s2 members in this server now!\nEnjoy your stay!",
				goodbye:
					"%s (%s1) left this server!\nThere's %s2 members in this server now!",
				boost:
					"%s (%s1) just boosted this server!\nThere's %s2 boosters in this server now!",
				unboost:
					"%s (%s1) unboosted this server!\nThere's %s2 boosters in this server now!",
			},
			commands: [],
			streamers: [],
		});

		this.client.experiments.set(id, []);

		return this.client.configurations.get(id);
	}

	delete(id: string): boolean {
		var data = this.client.configurations.get(id);
		if (!data) return false;

		this.client.configurations.delete(id);
		this.client.experiments.delete(id);

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

	checkAndMigrate(id: string): boolean {
		const data = this.client.configurations.get(id);
		if (!data) {
			this.create(id);
			return;
		}

		for (const key in this.defaultValue) {
			if (!data.hasOwnProperty(key)) {
				data[key] = this.defaultValue[key];
			}
		}

		this.client.configurations.set(id, data);

		return true;
	}
}
