import { ChatInputCommandInteraction, EmbedBuilder, bold } from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

export default class TwitchEnableCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "twitch",
			commandName: "settings",
			name: "enable",
			description: "Enables Twitch Notification System!",
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

		service.set(command.guildId, "twitch_system", true);

		const text = await lang.get(
			"SETTINGS_COMMANDS:ENABLE_TEXT",
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
