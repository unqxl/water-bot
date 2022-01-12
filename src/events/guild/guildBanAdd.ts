import { GuildBan } from "discord.js";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";

export default class GuildBanAddEvent extends Event {
	constructor() {
		super("guildPrefixUpdate");
	}

	async run(client: Bot, ban: GuildBan) {}
}
