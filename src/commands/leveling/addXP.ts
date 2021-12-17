import {
	Categories,
	ValidateReturn,
} from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class AddXPCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "addxp",

			description: {
				en: "Adds XP to Someone!",
				ru: "Добавляет XP Участнику!",
			},

			category: Categories.LEVELING,
			usage: "<prefix>addxp <user> <amount>",
			memberPermissions: ["ADMINISTRATOR"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		if (!member) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"addxp"
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

		const amount = args[1];
		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"addxp"
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

		if (!Number(amount)) {
			const text = lang.ERRORS.IS_NAN.replace("{input}", amount);
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
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		const amount = Number(args[1]);
		await this.client.levels.addXP(message.guild.id, member.id, amount);

		const text = lang.LEVELING.ADDED_XP.replace(
			"{xp}",
			this.client.functions.sp(amount)
		).replace("{target}", member.toString());
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
