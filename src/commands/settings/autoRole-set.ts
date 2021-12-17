import {
	Categories,
	ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class AutoRoleSetCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "autorole-set",
			aliases: ["ar-set"],

			description: {
				en: "Sets new Auto Role to Server DB!",
				ru: "Ставит Авто Роль в Базу Сервера!",
			},

			usage: "<prefix>autorole-set <role>",
			category: Categories.SETTINGS,
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
				"autorole-set"
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
			const type = lang.SETTINGS.CONFIG.TYPES.AUTO_ROLE;
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

		return {
			ok: true,
		};
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const role =
			message.mentions.roles.first() ||
			message.guild.roles.cache.get(args[0]);
		this.client.database.set(message.guild, "autoRole", role.id);

		const type = lang.SETTINGS.CONFIG.TYPES.AUTO_ROLE;
		const text = lang.SETTINGS.SETTED(type, role.toString());
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
