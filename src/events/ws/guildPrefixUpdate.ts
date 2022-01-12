import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";
import client from "../../index";

export default class GuildPrefixUpdateEvent extends Event {
	constructor() {
		super("guildPrefixUpdate", client.socket);
	}

	async run(client: Bot, config: GuildConfiguration) {
		client.configs.set(config.guild_id, config);
	}
}
