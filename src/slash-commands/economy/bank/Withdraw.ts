import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { ValidateReturn } from "../../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../../classes/Bot";

export default class DepositCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "bank",
			commandName: "economy",
			name: "withdraw",
			description: "Withdraws Coins from your Bank!",
			options: [
				{
					type: ApplicationCommandOptionType.Number,
					name: "amount",
					description: "Withdraw Amount",
					required: true,
				},
			],
		});
	}

	async validate(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const amount = command.options.getNumber("amount");
		const balance = await this.client.economy.bank.get(
			command.guildId,
			command.user.id
		);

		if (amount > balance) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);
			const action = lang.ECONOMY_ACTIONS.WITHDRAW;
			const text = lang.ERRORS.NOT_ENOUGH_MONEY(action);
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return {
				ok: false,
				error: {
					ephemeral: true,
					embeds: [embed],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const sp = (num: string | number) => this.client.functions.sp(num);

		const amount = command.options.getNumber("amount");

		this.client.economy.bank.withdraw(
			command.guildId,
			command.user.id,
			amount
		);

		this.client.economy.balance.add(
			command.guildId,
			command.user.id,
			amount
		);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = lang.ECONOMY.BANK_WITHDREW(sp(amount));
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(`✅ | ${bold(text)}`);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
