import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class DepositCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "deposit",

			description: {
				en: "Deposites Coins to Bank Balance!",
				ru: "Вносит Коины в Банк!",
			},

			category: Categories.ECONOMY,
			usage: "<prefix>deposit <amount>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const balance = await this.client.economy.balance.get(
			message.guild.id,
			message.author.id
		);

		const amount = args[0];
		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING("bank-add");
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
					embeds: [embed.data.toJSON()],
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
					embeds: [embed.data.toJSON()],
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
					embeds: [embed.data.toJSON()],
				},
			};
		}

		if (Number(amount) > balance) {
			const action = lang.ECONOMY_ACTIONS.DEPOSIT;
			const text = lang.ERRORS.NOT_ENOUGH_MONEY(action);
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
					embeds: [embed.data.toJSON()],
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
		const amount = Number(args[0]);

		this.client.economy.balance.subtract(
			message.guild.id,
			message.author.id,
			amount
		);

		this.client.economy.bank.add(
			message.guild.id,
			message.author.id,
			amount
		);

		const text = lang.ECONOMY.BANK_DEPOSITED(
			this.client.functions.sp(amount)
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
			embeds: [embed.data.toJSON()],
		});
	}
}
