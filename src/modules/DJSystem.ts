import { Message } from "discord.js";
import Goose from "classes/Goose";

export = class DJSystem {
    public client: Goose;

    constructor(client: Goose) {
        this.client = client;
    }

    async check(message: Message): Promise<DJRoleStatus> {
        const lang = await this.client.functions.getLanguageFile(message.guild);
        const roles = this.client.database.getSetting(message.guild, "djRoles");
		if (!roles.length) {
			return {
				status: false
			};
		}

		for (const { roleID } of roles) {
			const guildRole = message.guild.roles.cache.get(roleID);
			if (!guildRole) return;

			const memberRole = message.member.roles.cache.hasAny(roleID);
			if (!memberRole) {
				return {
					status: false,
					message: lang.SYSTEMS.DJ_ROLES.HASNT_ANY,
				};
			} else {
				return {
					status: true,
				};
			}
		}
    }
}

interface DJRoleStatus {
	status: boolean;
	message?: string;
}
