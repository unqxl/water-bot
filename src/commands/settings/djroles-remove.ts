import {
	Categories,
	ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class DJRolesRemoveCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "djroles-remove",

			description: {
				en: "Removes DJ Role from server database!",
				ru: "Удаляет DJ Роль из базы данных сервера!",
			},

			category: Categories.SETTINGS,
			usage: "<prefix>djroles-remove <role>",
			memberPermissions: ["ADMINISTRATOR"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const role =
			message.mentions.roles.first() ||
			message.guild.roles.cache.get(args[0]);

		if (!role) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"djroles-remove"
			);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		if (role.id === message.guild.roles.everyone.id) {
			const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
			const text = lang.ERRORS.CANNOT_BE_EVERYONE(type);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		const roles = this.client.database.getSetting(message.guild, "djRoles");
		const djRole = roles.find((x) => x.roleID === role.id);
		if (!djRole) {
			const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
			const text = lang.ERRORS.NOT_FOUND_IN_DB(type, role.toString());
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const role = message.mentions.roles.first();
		const roles = this.client.database.getSetting(message.guild, "djRoles");

		roles.filter((x) => x.roleID !== role.id);
		this.client.database.set(message.guild, "djRoles", roles);

		const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
		const text = lang.SETTINGS.DELETED(type, role.toString());
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
