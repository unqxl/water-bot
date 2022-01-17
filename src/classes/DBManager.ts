import { getRepository, Repository } from "typeorm";
import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";
import Bot from "./Bot";

export default class DBManager {
	public client: Bot;
	private readonly guildConfigRepository: Repository<GuildConfiguration> =
		getRepository(GuildConfiguration);

	constructor(client: Bot) {
		this.client = client;
	}

	async getGuild(guild_id: string): Promise<GuildConfiguration> {
		const config = await this.guildConfigRepository.findOne({ guild_id });
		if (!config) return await this.createGuild(guild_id);

		return await this.guildConfigRepository.findOne({ guild_id });
	}

	async createGuild(guild_id: string): Promise<GuildConfiguration> {
		const config = await this.guildConfigRepository.findOne({ guild_id });
		if (config) return config;

		const newConfig = await this.guildConfigRepository.create({ guild_id });
		this.guildConfigRepository.save(newConfig);

		return newConfig;
	}

	async deleteGuild(guild_id: string): Promise<boolean> {
		const config = await this.guildConfigRepository.findOne({ guild_id });
		if (!config) return false;

		this.guildConfigRepository.delete({ guild_id });
		return true;
	}

	async getSetting<K extends keyof GuildConfiguration>(
		guild_id: string,
		key: K
	): Promise<GuildConfiguration[K]> {
		var config = await this.guildConfigRepository.findOne({ guild_id });
		if (!config) config = await this.createGuild(guild_id);

		return config[key];
	}

	async getSettings(guild_id: string): Promise<GuildConfiguration> {
		var config = await this.guildConfigRepository.findOne({ guild_id });
		if (!config) config = await this.createGuild(guild_id);

		return config;
	}

	async set<K extends keyof GuildConfiguration>(
		guild_id: string,
		key: K,
		value: any
	): Promise<boolean> {
		var config = await this.guildConfigRepository.findOne({ guild_id });
		if (!config) config = await this.createGuild(guild_id);

		config[key] = value;

		var newConfig = await this.guildConfigRepository.save(config);
		this.client.configs.set(guild_id, newConfig);

		return true;
	}
}
