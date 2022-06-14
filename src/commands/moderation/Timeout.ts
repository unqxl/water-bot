import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";
import ms from "ms";

export default class TimeoutCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "moderation",
			name: "timeout",
			description: "Timeouts a member from the server.",
			memberPermissions: ["ModerateMembers"],
			botPermissions: ["ModerateMembers"],
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "member",
					description: "The member to timeout.",
					descriptionLocalizations: {
						ru: "Участник, которому нужно дать тайм-аут.",
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Number,
					name: "time",
					description: "Time for the timeout.",
					descriptionLocalizations: {
						ru: "Время тайм-аута.",
					},
					required: true,

					choices: [
						{
							name: "1 minute",
							nameLocalizations: {
								ru: "1 минута",
							},

							value: ms("1m"),
						},
						{
							name: "5 minutes",
							nameLocalizations: {
								ru: "5 минут",
							},

							value: ms("5m"),
						},
						{
							name: "10 minutes",
							nameLocalizations: {
								ru: "10 минут",
							},

							value: ms("10m"),
						},
						{
							name: "1 hour",
							nameLocalizations: {
								ru: "1 час",
							},

							value: ms("1h"),
						},
						{
							name: "1 day",
							nameLocalizations: {
								ru: "1 день",
							},

							value: ms("1d"),
						},
						{
							name: "1 week",
							nameLocalizations: {
								ru: "1 неделя",
							},

							value: ms("1w"),
						},
					],
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "reason",
					description: "The reason for the timeout.",
					descriptionLocalizations: {
						ru: "Причина тайм-аута.",
					},
					required: false,
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const member = command.options.getMember("member") || command.member;
		const time = command.options.getNumber("time");
		const reason =
			command.options.getString("reason") ||
			(await lang.get("OTHER:NONE"));

		if (member.id === command.member.id) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);

			const text = await lang.get("ERRORS:CANNOT_MODERATE_YOURSELF");
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${text}`);
			embed.setTimestamp();

			return command.reply({ embeds: [embed] });
		} else if (member.id === this.client.user.id) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);

			const text = await lang.get("ERRORS:CANNOT_MODERATE_BOT");
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${text}`);
			embed.setTimestamp();

			return command.reply({ embeds: [embed] });
		}

		await member.timeout(time, reason);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = await lang.get(
			"MODERATION_COMMANDS:TIMEOUT:TEXT",
			member.toString(),
			reason,
			ms(time, { long: true })
		);

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(`✅ | ${text}`);
		embed.setTimestamp();

		return command.reply({ embeds: [embed] });
	}
}
