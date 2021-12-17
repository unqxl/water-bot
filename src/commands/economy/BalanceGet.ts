import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class BalanceGetCommand extends Command {
	constructor(client: Goose) {
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

		const text = lang.ECONOMY.BALANCE_INFO.replace(
			"{balance}",
			this.client.functions.sp(balance)
		).replace("{bank}", this.client.functions.sp(bank));
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
