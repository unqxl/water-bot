import { Message } from "discord.js";
import Bot from "classes/Bot";

export = class DJSystem {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	async check(message: Message): Promise<DJRoleStatus> {
		const lang = await this.client.functions.getLanguageFile(message.guild);
		const roles = this.client.database.getSetting(message.guild, "djRoles");
		if (!roles.length) {
			return {
				status: false,
			};
		}

		for (const { roleID } of roles) {
			const guildRole = message.guild.roles.cache.get(roleID);
			if (!guildRole) continue;

			if (
				message.member.roles.cache.hasAny(...roles.map((r) => r.roleID))
			) {
				return {
					status: true,
				};
			} else {
				return {
					status: false,
					message: lang.SYSTEMS.DJ_ROLES.HASNT_ANY,
				};
			}
		}
	}
};

interface DJRoleStatus {
	status: boolean;
	message?: string;
}
