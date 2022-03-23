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
				"Red",
				text,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.data.toJSON()],
			});
		}

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			"",
			false,
			false,
			true
		);

		const title = country.country
			? `COVID-19: ${country.country}`
			: "COVID-19";

		embed.data.setTitle(title);
		embed.data.addFields(
			{
				name: lang.OTHER.COVID.TOTAL,
				value: [
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
				inline: true,
			},
			{
				name: lang.OTHER.COVID.TODAY,
				value: [
					`${bold(lang.OTHER.COVID.CASES)}: ${bold(
						this.client.functions.formatNumber(country.todayCases)
					)}`,

					`${bold(lang.OTHER.COVID.RECOVERED)}: ${bold(
						this.client.functions.formatNumber(
							country.todayRecovered
						)
					)}`,

					`${bold(lang.OTHER.COVID.DEATHS)}: ${bold(
						this.client.functions.formatNumber(country.todayDeaths)
					)}`,
				].join("\n"),
				inline: true,
			},
			{
				name: lang.OTHER.COVID.CRITICAL,
				value: bold(
					this.client.functions.formatNumber(country.critical)
				),
			},
			{
				name: lang.OTHER.COVID.TESTS,
				value: bold(this.client.functions.formatNumber(country.tests)),
			}
		);

		embed.data.setThumbnail(country.countryInfo?.flag || "");
		embed.data.setFooter({
			text: `${lang.OTHER.COVID.LAST_UPDATED}: ${new Date(
				country.updated
			).toLocaleString(locale)}`,
			iconURL: message.author.displayAvatarURL(),
		});

		return message.channel.send({
			embeds: [embed.data.toJSON()],
		});
	}
}
