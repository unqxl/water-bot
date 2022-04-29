import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";
import { getRepository } from "./Repository";
import { Repository } from "typeorm";

export class GuildService {
	public repository: Promise<Repository<GuildConfiguration>>;

	constructor() {
		this.init();
	}

	async init() {
		this.repository = getRepository();
	}

	async getSettings(id: string): Promise<GuildConfiguration> {
		const data = await (
			await this.repository
		).findOneBy({
			guild_id: id,
		});

		return data;
	}

	async getSetting<K extends keyof GuildConfiguration>(
		id: string,
		key: K
	): Promise<GuildConfiguration[K]> {
		const data = await (
			await this.repository
		).findOneBy({
			guild_id: id,
		});

		return data[key];
	}
}
