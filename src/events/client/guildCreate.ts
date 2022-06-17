import { GuildService } from "../../services/Guild";
import { Guild } from "discord.js";
import Event from "../../types/Event";
import Bot from "../../classes/Bot";

export default class GuildCreateEvent extends Event {
	constructor() {
		super("guildCreate");
	}

	async run(client: Bot, guild: Guild) {
		const service = new GuildService(client);
		service.create(guild.id);
	}
}
