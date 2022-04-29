import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import TurndownService from "turndown";
import Bot from "../../classes/Bot";

export default class SteamCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "steam",
			description: "Displays Steam Game Information!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "game",
					description: "Steam Game Name",
					required: true,
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		command.deferReply();

		const locale =
			(await this.client.database.getSetting(
				command.guildId,
				"locale"
			)) == "en-US"
				? "en"
				: "ru";

		const query = command.options.getString("game", true);
		const { success, data } = await this.client.apis.steam.getAppInfo(
			query,
			locale
		);

		if (!success) {
			const text = lang.ERRORS.NOT_FOUND("Steam API");
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.editReply({
				embeds: [embed],
			});
		}

		const pack = lang.OTHER.STEAM;
		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");
		const app_url = this.client.apis.steam.getStoreAppLink(
			data.steam_appid
		);

		const support_windows =
			data.platforms.windows === true
				? bold(lang.GLOBAL.YES)
				: bold(lang.GLOBAL.NO);

		const support_mac =
			data.platforms.mac === true
				? bold(lang.GLOBAL.YES)
				: bold(lang.GLOBAL.NO);

		const support_linux =
			data.platforms.linux === true
				? bold(lang.GLOBAL.YES)
				: bold(lang.GLOBAL.NO);

		const coming_soon =
			data.release_date.coming_soon === true
				? bold(lang.GLOBAL.YES)
				: bold(lang.GLOBAL.NO);

		const notes =
			typeof data.content_descriptors.notes === "string"
				? bold(data.content_descriptors.notes)
				: bold(lang.GLOBAL.NONE);

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
			`› ${bold(pack.FIELDS.ABOUT)}:`,
			`${about}`,
			"",
			`› ${bold(pack.FIELDS.LANGUAGES)}:`,
			`${bold(turndown.turndown(data.supported_languages))}`,
			"",
			`› ${bold(pack.FIELDS.PLATFORMS)}:`,
			`${bold(data.developers.join(", "))}`,
			"",
			`› ${bold(pack.FIELDS.PLATFORMS)}:`,
			`» ${bold(pack.PLATFORMS.WINDOWS)}: ${support_windows}`,
			`» ${bold(pack.PLATFORMS.MACOS)}: ${support_mac}`,
			`» ${bold(pack.PLATFORMS.LINUX)}: ${support_linux}`,
			"",
			`› ${bold(pack.FIELDS.CATEGORIES)}:`,
			`${bold(data.categories.map((c) => c.description).join(", "))}`,
			"",
			`› ${bold(pack.FIELDS.GENRES)}:`,
			`${bold(data.genres.map((c) => c.description).join(", "))}`,
			"",
			`› ${bold(pack.FIELDS.RECOMENDATIONS)}:`,
			`${bold(data.recommendations.total.toLocaleString(locale))}`,
			"",
			`› ${bold(pack.FIELDS.RELEASE_DATE)}:`,
			`» ${bold(pack.COMING_SOON)}: ${coming_soon}`,
			`» ${bold(pack.DATE)}: ${bold(data.release_date.date)}`,
			"",
			`› ${bold(pack.FIELDS.PRICE)}:`,
			`» ${bold(pack.PRICE)}: ${bold(
				data.price_overview.final_formatted
			)}`,
			`» ${bold(pack.DISCOUNT)}: ${bold(
				data.price_overview.discount_percent.toString() + "%"
			)}`,
			"",
			`› ${bold(pack.FIELDS.NOTES)}:`,
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
