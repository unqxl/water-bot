import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
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
		lang: typeof import("@locales/English").default
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
			const text = lang.ECONOMY.TIME_ERROR(
				collectAt.toLocaleString(locale),
				collectAt
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

		const text = lang.ECONOMY.WORK_REWARD(work.amount);
		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
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
