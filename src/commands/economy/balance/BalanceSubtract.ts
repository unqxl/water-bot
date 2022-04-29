import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
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
			description: "Gives Balance to Target!",
			memberPermissions: ["Administrator"],
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "target",
					description: "User to Give",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Number,
					name: "amount",
					description: "Amount to Give",
					required: true,
				},
			],
		});
	}

	async validate(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const target = command.options.getMember("target");
		if (target.user.bot) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);
			const text = lang.ERRORS.USER_BOT(target.toString());
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

		const target = command.options.getMember("target");
		const amount = command.options.getNumber("amount");

		this.client.economy.balance.add(command.guildId, target.id, amount);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = lang.ECONOMY.BALANCE_ADDED(sp(amount), target.toString());
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
