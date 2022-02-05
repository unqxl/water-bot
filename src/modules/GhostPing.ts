import { Message } from "discord.js";

export = class GhostPing {
	handle(message: Message): boolean {
		if (message.mentions.roles.size || message.mentions.members.size) {
			return true;
		}

		return false;
	}
};
