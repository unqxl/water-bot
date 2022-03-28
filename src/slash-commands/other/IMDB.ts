import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

// DayJS
import "dayjs/locale/en";
import "dayjs/locale/ru";

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
		lang: typeof import("@locales/English").default
	) {
		const locale =
			(await this.client.database.getSetting(
				command.guildId,
				"locale"
			)) == "en-US"
				? "en"
				: "ru";

		const query = command.options.getString("film", true);
		const data = await this.client.apis.imdb.getData(query, locale);
		if (!data) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");

			const text = lang.ERRORS.NOT_FOUND("IMDB");
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

		const length = dayjs
			.duration(Number(data.runtimeMins), "minutes")
			.locale(locale)
			.format(lang.GLOBAL.DAYJS_FORMAT);

		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");
		const pack = lang.OTHER.IMDB;

		const res = [
			data.plotLocal.length >= 1 ? bold(data.plotLocal) : bold(data.plot),
			"",
			`› ${bold(pack.FIELDS.DIRECTORS)}: ${bold(data.directors)}`,
			`› ${bold(pack.FIELDS.WRITERS)}: ${bold(data.writers)}`,
			`› ${bold(pack.FIELDS.STARS)}: ${bold(data.stars)}`,
			`› ${bold(pack.FIELDS.COMPANIES)}: ${bold(data.companies)}`,
			`› ${bold(pack.FIELDS.COUNTRIES)}: ${bold(data.countries)}`,
			`› ${bold(pack.FIELDS.LANGUAGES)}: ${bold(data.languages)}`,
			"",
			`› ${bold(pack.FIELDS.RATINGS)}:`,
			`» ${bold(pack.CONTENT_RATING)}: ${bold(data.contentRating)}`,
			`» ${bold(pack.IMDB_RATING)}: ${bold(data.imDbRating)}`,
			"",
			`› ${bold(pack.FIELDS.LENGTH)}: ${bold(length)}`,
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
