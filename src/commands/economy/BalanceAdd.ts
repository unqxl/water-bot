import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class BalanceAddCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "balance-add",
			aliases: ["bal-add"],

			description: {
				en: "Gives Balance to You/Target!",
				ru: "Добавляет Баланс Вам/Пользователю!",
			},

			category: Categories.ECONOMY,
			usage: "<prefix>balance-add <member> <amount>",

			memberPermissions: ["Administrator"],
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
			const text = lang.ERRORS.ARGS_MISSING("balance-add");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
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

		if (member.user.bot) {
			const text = lang.ERRORS.USER_BOT(member.toString());
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
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
			const text = lang.ERRORS.ARGS_MISSING("balance-add");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
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
			const text = lang.ERRORS.IS_NAN(amount);
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
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

		if (amount.includes("-")) {
			const text = lang.ERRORS.NEGATIVE_NUMBER(amount);
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
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

		this.client.economy.balance.add(
			message.guild.id,
			member.user.id,
			amount
		);

		const text = lang.ECONOMY.BALANCE_ADDED(
			this.client.functions.sp(amount),
			member.toString()
		);

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			false,
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
