import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { SubCommand } from "../../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../../classes/Bot";

export default class BalanceCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "balance",
			commandName: "economy",
			name: "get",
			description: "Returns Your Balance!",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const sp = (num: string | number) => this.client.functions.sp(num);
		const [balance, bank] = [
			await this.client.economy.balance.get(
				command.guildId,
				command.user.id
			),
			await this.client.economy.bank.get(
				command.guildId,
				command.user.id
			),
		];

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = lang.ECONOMY.BALANCE_INFO(sp(balance), sp(bank));
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(bold(text));
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
