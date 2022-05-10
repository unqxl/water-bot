import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	bold,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	hyperlink,
	SelectMenuBuilder,
	SelectMenuComponentOptionData,
	time,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

type OsuModes = "osu" | "fruits" | "mania" | "taiko";

const BEATMAP_STASTUSES = {
	graveyard: "Graveyard",
	wip: "WIP",
	pending: "Pending",
	ranked: "Ranked",
	approved: "Approved",
	qualified: "Qualified",
	loved: "Loved",
};

const MODES = {
	osu: "osu!standard",
	fruits: "osu!catch",
	mania: "osu!mania",
	taiko: "osu!taiko",
};

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

		command.reply({
			components: [row],
		});

		const message = await command.fetchReply();
		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.SelectMenu,
			time: 60000,
			max: 1,
			filter: (m) => m.user.id === command.user.id,
		});

		collector.on("collect", async (collected) => {
			if (!collected.isSelectMenu()) return;

			const selected = collected.values[0];
			const beatmap = await this.client.apis.osu.getBeatmapData(
				selected,
				mode
			);

			const { OSU_BEATMAP } = await (await lang.all()).OTHER_COMMANDS;
			const data = {
				artist: beatmap.artist,
				cover: beatmap.covers["cover@2x"],
				creator: beatmap.creator,
				url: `https://osu.ppy.sh/beatmapsets/${beatmap.id}`,
				status: BEATMAP_STASTUSES[beatmap.status],
				title: beatmap.title,
				submit_date: `${time(new Date(beatmap.submitted_date))} ${time(
					new Date(beatmap.submitted_date),
					"R"
				)}`,
				last_updated: `${time(new Date(beatmap.last_updated))} ${time(
					new Date(beatmap.last_updated),
					"R"
				)}`,
				tags: beatmap.tags,
				difficulties: beatmap.beatmaps.slice(0, 10).map((b) => {
					return {
						mode: MODES[b.mode],
						stars: b.difficulty_rating,
						title: b.version,
						bpm: b.bpm,
						url: b.url,
						ar: b.ar,
						cs: b.cs,
					};
				}),
			};

			const color = this.client.functions.color("Blurple");
			const author = this.client.functions.author(command.member);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setImage(data.cover);
			embed.setDescription(
				[
					`› ${bold(OSU_BEATMAP.ARTIST)}: ${bold(data.artist)}`,
					`› ${bold(OSU_BEATMAP.TITLE)}: ${bold(data.title)}`,
					`› ${bold(OSU_BEATMAP.CREATOR)}: ${bold(data.creator)}`,
					`› ${bold(OSU_BEATMAP.STATUS)}: ${bold(data.status)}`,
					`› ${bold(OSU_BEATMAP.URL)}: ${bold(data.url)}`,
					`› ${bold(OSU_BEATMAP.SUBMITTED_AT)}: ${bold(
						data.submit_date
					)}`,
					`› ${bold(OSU_BEATMAP.LAST_UPDATED)}: ${bold(
						data.last_updated
					)}`,
				].join("\n")
			);

			for (const {
				bpm,
				stars,
				ar,
				cs,
				mode,
				title,
				url,
			} of data.difficulties) {
				embed.addFields([
					{
						name: `${bold(`${title} - ${mode}`)}`,
						value: [
							`› ${bold(OSU_BEATMAP.BPM)}: ${bold(
								bpm.toString()
							)}`,
							`› ${bold(OSU_BEATMAP.AR)}: ${bold(ar.toString())}`,
							`› ${bold(OSU_BEATMAP.CS)}: ${bold(cs.toString())}`,
							`› ${bold(OSU_BEATMAP.STARS)}: ${bold(
								stars.toString()
							)}`,
							`› ${bold(OSU_BEATMAP.URL)}: ${bold(
								hyperlink("Click", url)
							)}`,
						].join("\n"),
						inline: true,
					},
				]);
			}

			command.editReply({
				embeds: [embed],
				components: [],
			});
			return;
		});

		collector.on("end", (collected, reason) => {
			if (reason === "time") {
				message.delete();
			}
		});
	}
}
