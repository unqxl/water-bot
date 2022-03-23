import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class BalanceSubtractCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "balance-subtract",
			aliases: ["bal-sub"],

			description: {
				en: "Subtracts Balance to You/Target!",
				ru: "Удаляет Коины с Баланса Пользователя!",
			},

			category: Categories.ECONOMY,
			usage: "<prefix>balance-subtract <member> <amount>",

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
			const text = lang.ERRORS.ARGS_MISSING("balance-subtract");
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
					embeds: [embed.embed.toJSON()],
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
					embeds: [embed.embed.toJSON()],
				},
			};
		}

		const amount = args[1];
		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING("balance-subtract");
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
					embeds: [embed.embed.toJSON()],
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
					embeds: [embed.embed.toJSON()],
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
					embeds: [embed.embed.toJSON()],
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

		this.client.economy.balance.subtract(
			message.guild.id,
			member.user.id,
			amount
		);

		const text = lang.ECONOMY.BALANCE_SUBT(
			this.client.functions.sp(amount),
			member.toString()
		);

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"❌",
			true
		);

		return message.channel.send({
			embeds: [embed.embed.toJSON()],
		});
	}
}
