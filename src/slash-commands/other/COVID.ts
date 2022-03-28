import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { Covid as COVIDData } from "../../interfaces/Covid";
import { SubCommand } from "../../types/Command/SubCommand";
import { request } from "undici";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";
import e from "express";

export default class COVIDCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "covid",
			description: "Displays COVID-19 Statistics in World/Country.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "country",
					description: "Country",
					required: false,
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const { locale } = await this.client.database.getSettings(
			command.guildId
		);

		const query = command.options.getString("country", false);
		var data: COVIDData;

		if (!query) {
			data = await (
				await request("https://disease.sh/v3/covid-19/all")
			).body.json();
		} else {
			var encoded = encodeURIComponent(query);
			data = await (
				await request(
					`https://disease.sh/v3/covid-19/countries/${encoded}`
				)
			).body.json();
		}

		if (data.message) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");

			const text = lang.ERRORS.COVID_NOT_FOUND(query);
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return await command.reply({
				ephemeral: true,
				embeds: [embed],
			});
		}

		const covid_pack = lang.OTHER.COVID;
		const formatNumber = this.client.functions.formatNumber;
		const date_updated = new Date(data.updated).toLocaleString(locale);

		const response = [
			`› ${bold(covid_pack.TOTAL)}:`,
			`» ${bold(covid_pack.CASES)}: ${bold(formatNumber(data.cases))}`,
			`» ${bold(covid_pack.RECOVERED)}: ${bold(
				formatNumber(data.recovered)
			)}`,
			`» ${bold(covid_pack.DEATHS)}: ${bold(formatNumber(data.deaths))}`,
			`» ${bold(covid_pack.TOTAL_POPULATION)}: ${bold(
				formatNumber(data.population)
			)}`,
			"",
			`› ${bold(covid_pack.TODAY)}:`,
			`» ${bold(covid_pack.CASES)}: ${bold(
				formatNumber(data.todayCases)
			)}`,
			`» ${bold(covid_pack.RECOVERED)}: ${bold(
				formatNumber(data.todayRecovered)
			)}`,
			`» ${bold(covid_pack.DEATHS)}: ${bold(
				formatNumber(data.todayDeaths)
			)}`,
			"",
			`› ${bold(covid_pack.CRITICAL)}: ${bold(
				formatNumber(data.critical)
			)}`,
			`› ${bold(covid_pack.TESTS)}: ${bold(formatNumber(data.tests))}`,
		].join("\n");

		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(response);
		embed.setThumbnail(data.countryInfo?.flag ?? null);
		embed.setFooter({
			text: `${covid_pack.LAST_UPDATED}: ${date_updated}`,
			iconURL: data.countryInfo?.flag ?? null,
		});
		embed.setTimestamp();

		return await command.reply({
			embeds: [embed],
		});
	}
}
