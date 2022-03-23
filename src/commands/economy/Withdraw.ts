import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class BankSubtactCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "bank-subtract",
			aliases: ["bank-sub"],

			description: {
				en: "Withdraws Coins into Bank!",
				ru: "Снимает деньги с Баланса Банка!",
			},

			category: Categories.ECONOMY,
			usage: "<prefix>bank-withdraw <amount>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const balance = await this.client.economy.bank.get(
			message.guild.id,
			message.author.id
		);

		const amount = args[0];
		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING("bank-subtract");
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
					embeds: [embed.json],
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
					embeds: [embed.json],
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
					embeds: [embed.json],
				},
			};
		}

		if (Number(amount) > balance) {
			const text = lang.ERRORS.NOT_ENOUGH_MONEY(
				lang.ECONOMY_ACTIONS.WITHDRAW
			);
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
					embeds: [embed.json],
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

		this.client.economy.bank.subtract(
			message.guild.id,
			message.author.id,
			amount
		);

		this.client.economy.balance.add(
			message.guild.id,
			message.author.id,
			amount
		);

		const text = lang.ECONOMY.BANK_WITHDREW(
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
			embeds: [embed.json],
		});
	}
}
