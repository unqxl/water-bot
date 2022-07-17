import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import TurndownService from "turndown";
import Bot from "../../classes/Bot";

export default class SteamCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",

			name: "steam",
			description: "Displays Steam game information.",
			descriptionLocalizations: {
				ru: "Показывает информацию об игре Steam.",
			},

			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "game",
					description: "Steam game name.",
					descriptionLocalizations: {
						ru: "Название игры в Steam.",
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
		if (this.client.config.keys.steam_key === null) {
			const color = this.client.functions.color("Red");
			const author = this.client.functions.author(command.member);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold("IMDB Key is not set.")}`);
			embed.setTimestamp();

			return command.reply({ embeds: [embed] });
		}

		command.deferReply();

		const service = new GuildService(this.client);
		const locale = await service.getSetting(command.guildId, "locale");
		var l =
			locale === "en-US"
				? "en"
				: locale === "ru-RU"
				? "ru"
				: locale === "uk-UA"
				? "uk"
				: locale;

		const query = command.options.getString("game", true);
		const { success, data } = await this.client.apis.steam.getAppInfo(
			query,
			locale
		);

		if (!success) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");
			const text = await lang.get("ERRORS:DATA_NOT_FOUND", "Steam API");

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.editReply({
				embeds: [embed],
			});
		}

		const {
			OTHER_COMMANDS: { STEAM },
			OTHER,
		} = await lang.all();

		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");
		const app_url = this.client.apis.steam.getStoreAppLink(data.steam_appid);

		const support_windows =
			data.platforms.windows === true ? bold(OTHER.YES) : bold(OTHER.NO);

		const support_mac =
			data.platforms.mac === true ? bold(OTHER.YES) : bold(OTHER.NO);

		const support_linux =
			data.platforms.linux === true ? bold(OTHER.YES) : bold(OTHER.NO);

		const coming_soon =
			data.release_date.coming_soon === true ? bold(OTHER.YES) : bold(OTHER.NO);

		const notes =
			typeof data.content_descriptors.notes === "string"
				? bold(data.content_descriptors.notes)
				: bold(OTHER.NONE);

		const turndown = new TurndownService();
		turndown.rules.add("img", {
			filter: "img",
			replacement: () => {
				return "";
			},
		});
		turndown.rules.add("br", {
			filter: ["br", "hr"],
			replacement: () => {
				return "\n";
			},
		});

		const about = turndown.turndown(data.about_the_game);
		const res = [
			`› ${bold(STEAM.ABOUT)}:`,
			`${about}`,
			"",
			`› ${bold(STEAM.LANGUAGES)}:`,
			`${bold(turndown.turndown(data.supported_languages))}`,
			"",
			`› ${bold(STEAM.PLATFORMS)}:`,
			`${bold(data.developers.join(", "))}`,
			"",
			`› ${bold(STEAM.PLATFORMS)}:`,
			`» ${bold(STEAM.WINDOWS)}: ${support_windows}`,
			`» ${bold(STEAM.MAC)}: ${support_mac}`,
			`» ${bold(STEAM.LINUX)}: ${support_linux}`,
			"",
			`› ${bold(STEAM.CATEGORIES)}:`,
			`${bold(data.categories.map((c) => c.description).join(", "))}`,
			"",
			`› ${bold(STEAM.GENRES)}:`,
			`${bold(data.genres.map((c) => c.description).join(", "))}`,
			"",
			`› ${bold(STEAM.RECOMMENDATIONS)}:`,
			`${bold(data.recommendations.total.toLocaleString(locale))}`,
			"",
			`› ${bold(STEAM.RELEASE_DATE)}:`,
			`» ${bold(STEAM.COMING_SOON)}: ${coming_soon}`,
			`» ${bold(STEAM.DATE)}: ${bold(data.release_date.date)}`,
			"",
			`› ${bold(STEAM.PRICE)}:`,
			`» ${bold(STEAM.PRICE)}: ${bold(data.price_overview.final_formatted)}`,
			`» ${bold(STEAM.DISCOUNT)}: ${bold(
				data.price_overview.discount_percent.toString() + "%"
			)}`,
			"",
			`› ${bold(STEAM.NOTES)}:`,
			`${notes}`,
		].join("\n");

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setTitle(data.name);
		embed.setDescription(res);
		embed.setURL(data.website ?? app_url);
		embed.setImage(data.header_image ?? null);

		return command.editReply({
			embeds: [embed],
		});
	}
}
