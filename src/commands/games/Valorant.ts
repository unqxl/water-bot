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

const regions: string[] = ["NA", "EU", "AP", "KR"];
export default class ValorantCommand extends SubCommand {
	public accountdata_url = (name: string, tag: string) =>
		`https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(
			name
		)}/${encodeURIComponent(tag)}`;

	public mmr_url = (region: string, name: string, tag: string) =>
		`https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(
			name
		)}/${encodeURIComponent(tag)}`;

	constructor(client: Bot) {
		super(client, {
			commandName: "games",

			name: "valorant",
			description: "Displays Valorant Player Stats.",
			descriptionLocalizations: {
				ru: "Отображает статистику игрока в Valorant.",
			},

			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "player",
					description: "The player's tag (ex: 'NAME#TAG').",
					descriptionLocalizations: {
						ru: "Тег игрока (например: 'ИМЯ#ТЕГ').",
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "region",
					description: "The player's region.",
					descriptionLocalizations: {
						ru: "Регион игрока.",
					},
					required: true,

					choices: regions.map((region) => ({
						name: region,
						value: region,
					})),
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		command.deferReply();

		const _player = command.options.getString("player");
		const player = _player.split("#");
		const region = command.options.getString("region");

		const accountDataURL = this.accountdata_url(player[0], player[1]);
		const mmrDataURL = this.mmr_url(region, player[0], player[1]);

		const mmrResponse = (await (await fetch(mmrDataURL)).json()) as any;
		const accountResponse = (await (
			await fetch(accountDataURL)
		).json()) as any;

		if (accountResponse.status !== 200) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(
				`❌ | ${bold(
					await lang.get("ERRORS:PLAYER_NOT_FOUND", _player)
				)}`
			);
			embed.setTimestamp();

			return command.editReply({
				embeds: [embed],
			});
		}

		const actStats =
			mmrResponse.data.by_season?.[
				Object.keys(mmrResponse.data.by_season)[0]
			];

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setTitle(
			`${accountResponse.data.name}#${accountResponse.data.tag}`
		);

		embed.addFields(
			{
				name: `› ${await lang.get("GAMES_COMMANDS:VALORANT:REGION")}`,
				value: `» ${accountResponse.data.region.toUpperCase()}`,
				inline: true,
			},
			{
				name: `› ${await lang.get("GAMES_COMMANDS:VALORANT:LEVEL")}`,
				value: `» ${accountResponse.data.account_level}`,
				inline: true,
			}
		);

		if (mmrResponse.data.current_data.elo) {
			embed.addFields(
				{
					name: `› ${await lang.get("GAMES_COMMANDS:VALORANT:RANK")}`,
					value: `» ${mmrResponse.data.current_data.currenttierpatched}`,
					inline: true,
				},
				{
					name: `› ${await lang.get("GAMES_COMMANDS:VALORANT:ELO")}`,
					value: `» ${mmrResponse.data.current_data.elo}`,
					inline: true,
				}
			);

			if (actStats.error) {
				const matches = await lang.get(
					"GAMES_COMMANDS:VALORANT:MATCHES"
				);

				embed.addFields(
					{
						name: `› ${await lang.get(
							"GAMES_COMMANDS:VALORANT:PLACEMENT"
						)}`,
						value: `» ${mmrResponse?.data?.current_data?.games_needed_for_rating} ${matches}`,
						inline: true,
					},
					{
						name: `› ${await lang.get(
							"GAMES_COMMANDS:VALORANT:WINS"
						)}`,
						value: `» ${actStats.wins} ${matches}`,
						inline: true,
					},
					{
						name: `› ${await lang.get(
							"GAMES_COMMANDS:VALORANT:PLAYED"
						)}`,
						value: `» ${actStats.number_of_games} ${matches}`,
						inline: true,
					}
				);
			}
		}

		embed.setThumbnail(accountResponse.data.card.small);
		embed.setImage(accountResponse.data.card.wide);
		embed.setFooter({
			text: "Powered by Valorant",
		});

		return command.editReply({
			embeds: [embed],
		});
	}
}
