import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class GiftCommand extends Command {
	constructor(client: Bot) {
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
			const text = lang.ERRORS.ARGS_MISSING("gift");
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
					embeds: [embed.toJSON()],
				},
			};
		}

		if (target.bot) {
			const text = lang.ERRORS.BALANCE_BOTS;
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
					embeds: [embed.toJSON()],
				},
			};
		}

		if (target.id === message.author.id) {
			const text = lang.ERRORS.GIFT_YOURSELF;
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
					embeds: [embed.toJSON()],
				},
			};
		}

		if (!coins) {
			const text = lang.ERRORS.ARGS_MISSING("gift");
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
					embeds: [embed.toJSON()],
				},
			};
		}

		if (!Number(coins)) {
			const text = lang.ERRORS.IS_NAN(coins);
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
					embeds: [embed.toJSON()],
				},
			};
		}

		if (coins.includes("-")) {
			const text = lang.ERRORS.NEGATIVE_NUMBER(coins);
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
					embeds: [embed.toJSON()],
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
		const balance = await this.client.economy.balance.get(
			message.guild.id,
			message.author.id
		);

		if (balance < amount) {
			const gift = lang.ECONOMY_ACTIONS.GIFT;
			const text = lang.ERRORS.NOT_ENOUGH_MONEY(gift);
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.toJSON()],
			});
		}

		this.client.economy.balance.subtract(
			message.guild.id,
			message.author.id,
			amount
		);

		this.client.economy.balance.add(message.guild.id, target.id, amount);

		const currentBalance = await this.client.economy.balance.get(
			message.guild.id,
			message.author.id
		);

		const text = lang.ECONOMY.GIFTED(
			this.client.functions.sp(amount),
			target.toString(),
			this.client.functions.sp(currentBalance)
		);

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.toJSON()],
		});
	}
}
