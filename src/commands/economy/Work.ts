import { ChatInputCommandInteraction, EmbedBuilder, time } from "discord.js";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class WorkCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "economy",
			name: "work",
			description: "Adds Work Amount to Your Balance!",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const work = await this.client.economy.rewards.work(
			command.guildId,
			command.user.id
		);

		if ("status" in work) {
			const locale = await this.client.database.getSetting(
				command.guildId,
				"locale"
			);

			const collectAt = new Date(work.data);
			const collectAtFormat = time(Math.ceil(work.data / 1000), "R");
			const text = await lang.get(
				"ERRORS:TIME_ERROR",
				collectAt.toLocaleString(locale),
				collectAtFormat
			);

			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}

		const sp = (num: string | number) => this.client.functions.sp(num);
		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = await lang.get(
			"ECONOMY_COMMANDS:WORK:TEXT",
			sp(work.amount)
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
