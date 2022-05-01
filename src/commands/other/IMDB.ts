import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

// DayJS
import "dayjs/locale/en";
import "dayjs/locale/ru";
import "dayjs/locale/uk";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default class IMDBCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "imdb",
			description: "Shows information about the film!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "film",
					description: "Film to search",
					required: true,
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const service = new GuildService();
		const locale = await service.getSetting(command.guildId, "locale");
		locale === "en-US"
			? dayjs.locale("en")
			: locale === "ru-RU"
			? dayjs.locale("ru")
			: dayjs.locale("uk");

		const duration = (data) => {
			if (locale === "en-US") {
				return dayjs
					.duration(Number(data.runtimeMins), "minutes")
					.format("DD [days], HH [hours], mm [minutes]");
			} else if (locale === "ru-RU") {
				return dayjs
					.duration(Number(data.runtimeMins), "minutes")
					.format("DD [days], HH [hours], mm [minutes]");
			} else if (locale === "uk-UA") {
				return dayjs
					.duration(Number(data.runtimeMins), "minutes")
					.format("DD [days], HH [hours], mm [minutes]");
			}
		};

		const query = command.options.getString("film", true);
		const data = await this.client.apis.imdb.getData(query, locale);
		if (!data) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");
			const text = await lang.get("ERRORS:DATA_NOT_FOUND", "IMDB");

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.reply({
				ephemeral: true,
				embeds: [embed],
			});
		}

		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");
		const { IMDB } = await (await lang.all()).OTHER_COMMANDS;

		const res = [
			data.plotLocal.length >= 1 ? bold(data.plotLocal) : bold(data.plot),
			"",
			`› ${bold(IMDB.DIRECTORS)}: ${bold(data.directors)}`,
			`› ${bold(IMDB.WRITERS)}: ${bold(data.writers)}`,
			`› ${bold(IMDB.STARS)}: ${bold(data.stars)}`,
			`› ${bold(IMDB.COMPANIES)}: ${bold(data.companies)}`,
			`› ${bold(IMDB.COUNTRIES)}: ${bold(data.countries)}`,
			`› ${bold(IMDB.LANGUAGES)}: ${bold(data.languages)}`,
			"",
			`› ${bold(IMDB.RATINGS)}:`,
			`» ${bold(IMDB.CONTENT_RATING)}: ${bold(data.contentRating)}`,
			`» ${bold(IMDB.IMDB_RATING)}: ${bold(data.imDbRating)}`,
			"",
			`› ${bold(IMDB.LENGTH)}: ${bold(duration(data))}`,
		].join("\n");

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setTitle(data.fullTitle);
		embed.setThumbnail(data.image);
		embed.setDescription(res);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
