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
		const sp = (num: string | number) => this.client.functions.sp(num);

		const balance = await this.client.economy.balance.get(
			message.guild.id,
			message.author.id
		);

		const bank = await this.client.economy.bank.get(
			message.author.id,
			message.guild.id
		);

		const text = lang.ECONOMY.BALANCE_INFO(sp(balance), sp(bank));
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
