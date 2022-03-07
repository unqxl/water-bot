import { Message, Embed, Util } from "discord.js";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
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

export default class IMDBCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "imdb",

			description: {
				en: "Shows information about film!",
				ru: "Показывает информацию о фильме!",
			},

			category: Categories.OTHER,
			usage: "<prefix>imdb <film_name>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const name = args.join(" ");
		if (!name) {
			const text = lang.ERRORS.ARGS_MISSING("imdb");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const locale = await this.client.database.getSetting(
			message.guild.id,
			"locale"
		);
		const l = locale === "en-US" ? "en" : "ru";

		const name = args.join(" ");
		const data = await this.client.apis.imdb.getData(name, l);
		if (!data) {
		}

		const embed = new Embed()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: message.author.username,
				iconURL: message.author.displayAvatarURL(),
			})
			.setTitle(data.fullTitle)
			.setThumbnail(data.image)
			.setDescription(
				data.plotLocal.length > 1
					? bold(data.plotLocal)
					: bold(data.plot)
			);

		embed.addFields(
			{
				name: lang.OTHER.IMDB.FIELDS.DIRECTORS,
				value: bold(data.directors),
				inline: true,
			},
			{
				name: lang.OTHER.IMDB.FIELDS.WRITERS,
				value: bold(data.writers),
				inline: true,
			},
			{
				name: lang.OTHER.IMDB.FIELDS.STARS,
				value: bold(data.stars),
				inline: true,
			},
			{
				name: lang.OTHER.IMDB.FIELDS.COMPANIES,
				value: bold(data.companies),
				inline: true,
			},
			{
				name: lang.OTHER.IMDB.FIELDS.COUNTRIES,
				value: bold(data.countries),
				inline: true,
			},
			{
				name: lang.OTHER.IMDB.FIELDS.LANGUAGES,
				value: bold(data.languages),
				inline: true,
			},
			{
				name: lang.OTHER.IMDB.FIELDS.RATINGS,
				value: [
					`› ${bold(lang.OTHER.IMDB.CONTENT_RATING)}: ${bold(
						data.contentRating
					)}`,
					`› ${bold(lang.OTHER.IMDB.IMDB_RATING)}: ${bold(
						data.imDbRating
					)}`,
				].join("\n"),
				inline: true,
			},
			{
				name: lang.OTHER.IMDB.FIELDS.LENGTH,
				value: bold(
					dayjs
						.duration(Number(data.runtimeMins), "minutes")
						.locale(l)
						.humanize()
				),
				inline: true,
			}
		);

		embed.setFooter({
			text: `${lang.OTHER.IMDB.RELEASE_DATE}: ${data.releaseDate}`,
		});

		return message.channel.send({
			embeds: [embed],
		});
	}
}
