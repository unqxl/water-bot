import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	bold,
	ApplicationCommandOptionType,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

export default class StreamerAddCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "twitch",
			commandName: "settings",
			name: "streamer-add",
			description: "Adds Streamer into Twitch Notification List!",
			memberPermissions: ["ManageGuild"],
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "streamer",
					description: "Streamer Login",
					required: true,
				},
			],
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

		const streamer = command.options.getString("streamer", true);
		const streamers = service.getSetting(command.guildId, "streamers");

		if (streamers.find((x) => x.name === streamer)) {
			const text = await lang.get("ERRORS:ALREADY_IN_LIST", streamer);
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setTitle(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.reply({
				embeds: [embed],
			});
		}

		streamers.push({
			name: streamer,
			last_stream: null,
		});

		service.set(command.guildId, "streamers", streamers);

		const text = await lang.get(
			"SETTINGS_COMMANDS:ADD_TEXT",
			streamer,
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
