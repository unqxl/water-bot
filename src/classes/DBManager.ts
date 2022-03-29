import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";
import { GuildConfig } from "../types/types";
import { Repository } from "typeorm";
import Bot from "./Bot";

export default class DBManager {
	public client: Bot;

	private guildConfigRepository: Repository<GuildConfiguration>;

	constructor(client: Bot) {
		this.client = client;
		this.guildConfigRepository =
			this.client.datasource.getRepository(GuildConfiguration);
	}

	async getGuild(guild_id: string): Promise<GuildConfiguration> {
		const config = await this.guildConfigRepository.findOne({
			where: { guild_id },
		});
		if (!config) return await this.createGuild(guild_id);

		return await this.guildConfigRepository.findOne({
			where: { guild_id },
		});
	}

	async createGuild(guild_id: string): Promise<GuildConfiguration> {
		const config = await this.guildConfigRepository.findOne({
			where: { guild_id },
		});
		if (config) return config;

		const newConfig = await this.guildConfigRepository.create({ guild_id });
		this.guildConfigRepository.save(newConfig);

		this.client.configs.set(guild_id, newConfig);
		this.client.custom_commands.set(guild_id, []);
		this.client.configurations.set(guild_id, {
			djRoles: [],
			twitchSystem: false,
			twitchStreamers: [],
		});

		return newConfig;
	}

	async deleteGuild(guild_id: string): Promise<boolean> {
		const config = await this.guildConfigRepository.findOne({
			where: { guild_id },
		});
		if (!config) return false;

		this.guildConfigRepository.delete({ guild_id });
		this.client.configs.delete(guild_id);
		this.client.custom_commands.delete(guild_id);
		this.client.configurations.delete(guild_id);

		return true;
	}

	async getSetting<K extends keyof GuildConfiguration>(
		guild_id: string,
		key: K
	): Promise<GuildConfiguration[K]> {
		let config = await this.guildConfigRepository.findOne({
			where: { guild_id },
		});
		if (!config) config = await this.createGuild(guild_id);

		return config[key];
	}

	async getSettings(guild_id: string): Promise<GuildConfiguration> {
		let config = await this.guildConfigRepository.findOne({
			where: { guild_id },
		});
		if (!config) config = await this.createGuild(guild_id);

		return config;
	}

	async set<K extends keyof GuildConfiguration>(
		guild_id: string,
		key: K,
		value: GuildConfiguration[K]
	): Promise<boolean> {
		let config = await this.guildConfigRepository.findOne({
			where: { guild_id },
		});
		if (!config) config = await this.createGuild(guild_id);

		config[key] = value;

		const newConfig = await this.guildConfigRepository.save(config);
		this.client.configs.set(guild_id, newConfig);

		return true;
	}

	async setConfigProp<K extends keyof GuildConfig>(
		guild_id: string,
		key: K,
		value: GuildConfig[K]
	): Promise<boolean> {
		const config = await this.client.configurations.get(guild_id);
		if (!config) return;

		config[key] = value;
		this.client.configurations.set(guild_id, config);

		return true;
	}
}
