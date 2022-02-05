import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";
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
		const balance = this.client.economy.bank.fetch(
			message.author.id,
			message.guild.id
		);

		const amount = args[0];
		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"bank-subtract"
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

		if (Number(amount) > balance) {
			const text = lang.ERRORS.NOT_ENOUGH_MONEY(
				lang.ECONOMY_ACTIONS.WITHDRAW
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
			amount,
			message.author.id,
			message.guild.id
		);

		this.client.economy.balance.add(
			amount,
			message.author.id,
			message.guild.id
		);

		const text = lang.ECONOMY.BALANCE_SUBT.replace(
			"{amount}",
			this.client.functions.sp(amount)
		);
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			false,
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
