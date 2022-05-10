import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SelectMenuBuilder,
	SelectMenuComponentOptionData,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

type OsuModes = "osu" | "fruits" | "mania" | "taiko";

export default class BeatmapCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "osu",
			commandName: "other",
			name: "beatmap",
			description: "Shows osu!map statistics",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "map",
					description: "Beatmap Title",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "mode",
					description: "osu!mode",
					required: false,
					choices: [
						{
							name: "osu!standart",
							value: "osu",
						},
						{
							name: "Catch The Beat",
							value: "fruits",
						},
						{
							name: "osu!mania",
							value: "mania",
						},
						{
							name: "osu!taiko",
							value: "taiko",
						},
					],
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const service = new GuildService(this.client);
		const locale = await service.getSetting(command.guildId, "locale");

		const map = command.options.getString("map", true);
		const mode = command.options.getString("mode") as OsuModes;

		var data = await this.client.apis.osu.getBeatmapList(map, mode);
		data = data.sort((a, b) => b.play_count - a.play_count);
		data = data.slice(0, 10);

		const options: SelectMenuComponentOptionData[] = [];
		for (let i = 0; i < data.length; i++) {
			options.push({
				label: `${data[i].artist} - ${data[i].title} (${data[i].creator})`,
				value: data[i].id.toString(),
			});
		}

		const menu = new SelectMenuBuilder();
		menu.setCustomId("beatmaplist");
		menu.setMinValues(1);
		menu.setMaxValues(1);
		menu.setOptions(options);

		const row = new ActionRowBuilder<SelectMenuBuilder>();
		row.addComponents([menu]);

		return command.reply({
			components: [row],
		});
	}
}
