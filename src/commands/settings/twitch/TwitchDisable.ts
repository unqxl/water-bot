import { ChatInputCommandInteraction, EmbedBuilder, bold } from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

export default class TwitchDisableCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "twitch",
			commandName: "settings",

			name: "disable",
			description: "Disables Twitch Notification System.",
			descriptionLocalizations: {
				ru: "Выключает систему Twitch Уведомлений.",
			},

			memberPermissions: ["ManageGuild"],
			options: [],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const service = new GuildService(this.client);
		const {
			SETTINGS_COMMANDS: { CONFIG },
		} = await lang.all();

		service.set(command.guildId, "twitch_system", false);

		const text = await lang.get(
			"SETTINGS_COMMANDS:DISABLE_TEXT",
			CONFIG.TWITCH_SYSTEM
		);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setTitle(`✅ | ${bold(text)}`);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
