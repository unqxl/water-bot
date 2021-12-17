import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import {
	Categories,
	ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class GiftCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "gift",

			description: {
				en: "Gives Some Coins to Target!",
				ru: "Передаёт Коины Пользователю!",
			},

			category: Categories.ECONOMY,
			usage: "<prefix>gift <target> <amount>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const target = message.mentions.users.first();
		const coins = args[1];

		if (!target) {
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "gift");
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
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

		if (!coins) {
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "gift");
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
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

		if (!Number(coins)) {
			const text = lang.ERRORS.IS_NAN.replace("{input}", coins);
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
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
		const target = message.mentions.users.first();
		const amount = Number(args[1]);
		const balance = this.client.economy.balance.fetch(
			message.author.id,
			message.guild.id
		);

		if (target.bot) {
			const text = lang.ERRORS.BALANCE_BOTS;
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
				bold(text),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		if (target.id === message.author.id) {
			const text = lang.ERRORS.GIFT_YOURSELF;
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
				bold(text),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		if (balance < amount) {
			const gift = lang.ECONOMY_ACTIONS.GIFT;
			const notEnough = lang.ERRORS.NOT_ENOUGH_MONEY(gift);
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
				bold(notEnough),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		this.client.economy.balance.subtract(
			amount,
			message.author.id,
			message.guild.id
		);

		this.client.economy.balance.add(amount, target.id, message.guild.id);

		const currentBalance = this.client.economy.balance.fetch(
			message.author.id,
			message.guild.id
		);

		const userBalance = this.client.economy.balance.fetch(
			target.id,
			message.guild.id
		);

		const giftedText = lang.ECONOMY.GIFTED.replace(
			"{amount}",
			this.client.functions.sp(amount)
		)
			.replace("{user}", target.toString())
			.replace(
				"{current_balance}",
				this.client.functions.sp(currentBalance)
			)
			.replace("{user_balance}", this.client.functions.sp(userBalance));

		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(giftedText),
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
