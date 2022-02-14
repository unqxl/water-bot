import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class BalanceGetCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "balance-get",
			aliases: ["bal-get"],

			description: {
				en: "Returns Your Balance!",
				ru: "Возвращает Ваш Баланс!",
			},

			category: Categories.ECONOMY,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const balance = this.client.economy.balance.fetch(
			message.author.id,
			message.guild.id
		);
		const bank = this.client.economy.bank.fetch(
			message.author.id,
			message.guild.id
		);

		const text = lang.ECONOMY.BALANCE_INFO(
			this.client.functions.sp(balance),
			this.client.functions.sp(bank)
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
