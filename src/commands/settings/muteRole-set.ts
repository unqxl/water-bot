import {
	Categories,
	ValidateReturn,
} from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class MuteRoleSetCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "muterole-set",
			aliases: ["mr-set"],

			description: {
				en: "Sets new Mute Role to Server DB!",
				ru: "Ставит Мут Роль в Базу Сервера!",
			},

			usage: "<prefix>muterole-set <role>",
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
				"muterole-set"
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
			const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
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

		this.client.database.set(message.guild, "muteRole", role.id);
		this.client.moderation.mutes.setRole(message.guild, role);

		const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
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
