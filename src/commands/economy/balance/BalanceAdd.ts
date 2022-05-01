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

export default class BalanceSubtractCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "balance",
			commandName: "economy",
			name: "subtract",
			description: "Removes Balance from Target!",
			memberPermissions: ["Administrator"],
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "target",
					description: "User to Subtract",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Number,
					name: "amount",
					description: "Amount to Subtract",
					required: true,
				},
			],
		});
	}

	async validate(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	): Promise<ValidateReturn> {
		const target = command.options.getMember("target");
		if (target.user.bot) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);
			const text = await lang.get("ERRORS:USER_IS_BOT");
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

		const target = command.options.getMember("target");
		const amount = command.options.getNumber("amount");

		this.client.economy.balance.subtract(
			command.guildId,
			target.id,
			amount
		);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = await lang.get(
			"ECONOMY_COMMANDS:BALANCE_ADD:TEXT",
			sp(amount),
			target.user.toString()
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
