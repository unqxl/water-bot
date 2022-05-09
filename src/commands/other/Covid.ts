import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { Covid as COVIDData } from "../../types/Covid";
import { SubCommand } from "../../types/Command/SubCommand";
import { request } from "undici";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

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
		lang: LanguageService
	) {
		const service = new GuildService(this.client);
		const locale = await service.getSetting(command.guildId, "locale");

		const query = command.options.getString("country", false);
		let data: COVIDData;

		if (!query) {
			data = await (
				await request("https://disease.sh/v3/covid-19/all")
			).body.json();
		} else {
			const encoded = encodeURIComponent(query);
			data = await (
				await request(
					`https://disease.sh/v3/covid-19/countries/${encoded}`
				)
			).body.json();
		}

		if (data.message) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");
			const text = await lang.get("ERRORS:DATA_NOT_FOUND", "COVID");

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

		const { COVID } = await (await lang.all()).OTHER_COMMANDS;
		const date_updated = new Date(data.updated).toLocaleString(locale);
		const sp = (num: string | number) => this.client.functions.sp(num);

		const response = [
			`› ${bold(COVID.TOTAL)}:`,
			`» ${bold(COVID.CASES)}: ${bold(sp(data.cases))}`,
			`» ${bold(COVID.RECOVERED)}: ${bold(sp(data.recovered))}`,
			`» ${bold(COVID.DEATHS)}: ${bold(sp(data.deaths))}`,
			`» ${bold(COVID.POPULATION)}: ${bold(sp(data.population))}`,
			"",
			`› ${bold(COVID.TODAY)}:`,
			`» ${bold(COVID.CASES)}: ${bold(sp(data.todayCases))}`,
			`» ${bold(COVID.RECOVERED)}: ${bold(sp(data.todayRecovered))}`,
			`» ${bold(COVID.DEATHS)}: ${bold(sp(data.todayDeaths))}`,
			`› ${bold(COVID.CRITICAL)}: ${bold(sp(data.critical))}`,
		].join("\n");

		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(response);
		embed.setThumbnail(data.countryInfo?.flag ?? null);
		embed.setFooter({
			text: `${COVID.LAST_UPDATE}: ${date_updated}`,
			iconURL: data.countryInfo?.flag ?? null,
		});
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
