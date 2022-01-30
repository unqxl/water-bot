import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { request } from "undici";
import { Covid } from "../../interfaces/Covid";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class COVIDCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "covid",

			description: {
				en: "Shows Covid-19 Statistics in Country/World!",
				ru: "Показывает статистику Коронавируса в Стране/Городе!",
			},

			category: Categories.OTHER,
			usage: "<prefix>covid [coutry]",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		let locale = await this.client.database.getSetting(
			message.guild.id,
			"locale"
		);
		let query = args.join(" ");
		let country: Covid;

		if (!query) {
			country = await (
				await request("https://disease.sh/v3/covid-19/all")
			).body.json();
		} else {
			country = await (
				await request(
					`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(
						query
					)}`
				)
			).body.json();
		}

		if (country.message) {
			const text = lang.ERRORS.COVID_NOT_FOUND(query);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌"
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			"...",
			false,
			true
		);

		const title = country.country
			? `COVID-19: ${country.country}`
			: "COVID-19";

		embed.description = undefined;
		embed.setTitle(title);

		embed.addField(
			lang.OTHER.COVID.TOTAL,
			[
				`${bold(lang.OTHER.COVID.CASES)}: ${bold(
					this.client.functions.formatNumber(country.cases)
				)}`,

				`${bold(lang.OTHER.COVID.RECOVERED)}: ${bold(
					this.client.functions.formatNumber(country.recovered)
				)}`,

				`${bold(lang.OTHER.COVID.DEATHS)}: ${bold(
					this.client.functions.formatNumber(country.deaths)
				)}`,

				`${bold(lang.OTHER.COVID.TOTAL_POPULATION)}: ${bold(
					this.client.functions.formatNumber(country.population)
				)}`,
			].join("\n"),
			true
		);

		embed.addField(
			lang.OTHER.COVID.TODAY,
			[
				`${bold(lang.OTHER.COVID.CASES)}: ${bold(
					this.client.functions.formatNumber(country.cases)
				)}`,

				`${bold(lang.OTHER.COVID.RECOVERED)}: ${bold(
					this.client.functions.formatNumber(country.recovered)
				)}`,

				`${bold(lang.OTHER.COVID.DEATHS)}: ${bold(
					this.client.functions.formatNumber(country.deaths)
				)}`,
			].join("\n"),
			true
		);

		embed.addField(
			lang.OTHER.COVID.CRITICAL,
			bold(this.client.functions.formatNumber(country.critical))
		);

		embed.addField(
			lang.OTHER.COVID.TESTS,
			bold(this.client.functions.formatNumber(country.tests)),
			true
		);

		embed.setThumbnail(country.countryInfo?.flag || "");
		embed.setFooter({
			text: `${lang.OTHER.COVID.LAST_UPDATED}: ${new Date(
				country.updated
			).toLocaleString(locale)}`,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		});

		return message.channel.send({
			embeds: [embed],
		});
	}
}
