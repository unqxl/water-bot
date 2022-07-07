import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { ValidateReturn } from "../../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../../classes/Bot";

export default class DepositCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "bank",
			commandName: "economy",

			name: "deposit",
			description: "Deposits money into the bank.",
			descriptionLocalizations: {
				ru: "Пополняет ваш банковский счет.",
			},

			options: [
				{
					type: ApplicationCommandOptionType.Number,
					name: "amount",
					description: "The amount of money to deposit.",
					descriptionLocalizations: {
						ru: "Сумма для пополнения.",
					},
					required: true,
				},
			],
		});
	}

	async validate(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	): Promise<ValidateReturn> {
		const amount = command.options.getNumber("amount");
		const balance = await this.client.economy.balance.get(
			command.guildId,
			command.user.id
		);

		if (amount > balance) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);
			const action = await lang.get("ECONOMY_ACTIONS:DEPOSIT");
			const text = await lang.get("ERRORS:NOT_ENOUGH_MONEY", action);

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
		lang: LanguageService
	) {
		const sp = (num: string | number) => this.client.functions.sp(num);

		const amount = command.options.getNumber("amount");

		this.client.economy.balance.subtract(
			command.guildId,
			command.user.id,
			amount
		);

		this.client.economy.bank.deposit(
			command.guildId,
			command.user.id,
			amount
		);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = await lang.get(
			"ECONOMY_COMMANDS:BANK_DEPOSIT:TEXT",
			sp(amount)
		);

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
