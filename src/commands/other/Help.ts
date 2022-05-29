import { bold, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

export default class HelpCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "help",
			description: "Displays Bot Command Categories.",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const {
			ECONOMY_DESCRIPTION,
			MUSIC_DESCRIPTION,
			OTHER_DESCRIPTION,
			OWNER_DESCRIPTION,
			SETTINGS_DESCRIPTION,
		} = await (
			await lang.all()
		).OTHER_COMMANDS.HELP;

		const text = [
			`**/economy** - ${bold(ECONOMY_DESCRIPTION)}`,
			`**/music** - ${bold(MUSIC_DESCRIPTION)}`,
			`**/other** - ${bold(OTHER_DESCRIPTION)}`,
			`**/owner** - ${bold(OWNER_DESCRIPTION)}`,
			`**/settings** - ${bold(SETTINGS_DESCRIPTION)}`,
		].join("\n");

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(text);
		embed.setTimestamp();

		command.reply({
			embeds: [embed],
		});
	}
}
