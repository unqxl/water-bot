import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

export default class BanCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "moderation",
			name: "ban",
			description: "Bans a member of the server.",
			memberPermissions: ["BanMembers"],
			botPermissions: ["BanMembers"],
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "member",
					description: "The member to ban.",
					descriptionLocalizations: {
						ru: "Участник, которого нужно забанить.",
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "reason",
					description: "The reason for the ban.",
					descriptionLocalizations: {
						ru: "Причина бана.",
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

		await member.ban({ reason });

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const text = await lang.get(
			"MODERATION_COMMANDS:BAN:TEXT",
			member.toString(),
			reason
		);

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(`✅ | ${text}`);
		embed.setTimestamp();

		return command.reply({ embeds: [embed] });
	}
}
