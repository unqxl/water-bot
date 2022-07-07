import {
	ApplicationCommandOptionType,
	bold,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import { fetch } from "undici";
import Bot from "../../classes/Bot";

export default class CSGOCommand extends SubCommand {
	public profile_url = (id: string) => `https://steamcommunity.com/id/${id}`;
	public url = (player: string) =>
		`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${encodeURIComponent(
			player
		)}`;

	constructor(client: Bot) {
		super(client, {
			commandName: "games",

			name: "csgo",
			description: "Displays CS:GO Player Stats.",
			descriptionLocalizations: {
				ru: "Отображает статистику CS:GO игрока.",
			},

			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "player",
					description: "The player's name.",
					descriptionLocalizations: {
						ru: "Имя игрока.",
					},
					required: true,
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const player = command.options.getString("player");

		const response = (await (
			await fetch(this.url(player), {
				headers: {
					"TRN-Api-Key": this.client.config.keys.tracker_key,
				},
			})
		).json()) as any;

		if (response.errors) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);

			const variants = [
				{
					key: "The stat collector returned the following status code: NotFound",
					value: await lang.get("ERRORS:PLAYER_NOT_FOUND", player),
				},
				{
					key: "The player either hasn't played CSGO or their profile is private.",
					value: await lang.get("ERRORS:PROFILE_ERROR", player),
				},
			];

			const variant = variants.find(
				(variant) => variant.key === response.errors[0].message
			);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(variant.value)}`);
			embed.setTimestamp();

			return command.reply({
				embeds: [embed],
			});
		}

		const overview = response.data.segments.find(
			(x: { type: string }) => x.type === "overview"
		);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setTitle(`${bold(player)}'s CS:GO Stats`);
		embed.setURL(
			this.profile_url(response.data.platformInfo.platformUserId)
		);

		const restrictedKeys = [
			"timePlayed",
			"dominationRevenges",
			"hostagesRescued",
		];

		for (const k of Object.keys(overview.stats)
			.filter((x) => !restrictedKeys.includes(x))
			.map((x) => ({
				key: overview.stats[x].displayName,
				value: overview.stats[x].displayValue,
			}))) {
			embed.addFields({
				name: `› ${bold(k.key)}`,
				value: `» ${bold(k.value)}`,
				inline: true,
			});
		}

		embed.setThumbnail(
			overview.stats.rankScore
				? overview.stats.rankScore.metadata.iconUrl
				: response.data.platformInfo.avatarUrl
		);

		embed.setFooter({
			text: "Powered by Tracker.gg",
		});

		return command.reply({
			embeds: [embed],
		});
	}
}
