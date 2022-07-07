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

export default class BalanceAddCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "balance",
			commandName: "economy",

			name: "add",
			description: "Gives Balance to Member.",
			descriptionLocalizations: {
				ru: "Выдаёт баланс у участника.",
			},

			memberPermissions: ["Administrator"],

			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "member",
					description: "User to Give Balance to.",
					descriptionLocalizations: {
						ru: "Пользователь, которому будет выдан баланс.",
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Number,
					name: "amount",
					description: "Amount to Give.",
					descriptionLocalizations: {
						ru: "Сумма, которую нужно выдать.",
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
		const member = command.options.getMember("member");
		if (member.user.bot) {
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

		const member = command.options.getMember("member");
		const amount = command.options.getNumber("amount");

		this.client.economy.balance.add(command.guildId, member.id, amount);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = await lang.get(
			"ECONOMY_COMMANDS:BALANCE_SUBT:TEXT",
			sp(amount),
			member.toString()
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
