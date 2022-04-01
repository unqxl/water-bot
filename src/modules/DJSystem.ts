import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import Bot from "../classes/Bot";

export = class DJSystem {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	async check(
		message: Message | ChatInputCommandInteraction
	): Promise<DJRoleStatus> {
		const lang = await this.client.functions.getLanguageFile(
			message.guild.id
		);
		const { djRoles } = this.client.configurations.get(message.guild.id);
		if (!djRoles.length) {
			return {
				status: false,
			};
		}

		for (const roleID of djRoles) {
			const guildRole = message.guild.roles.cache.get(roleID);
			if (!guildRole) continue;

			if (
				(message.member as GuildMember).roles.cache.hasAny(
					...djRoles.map((r) => r)
				)
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
