import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Util,
} from "discord.js";
import { SubCommand } from "../../types/Command/SubCommand";
import { request } from "undici";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class MDNCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "mdn",
			description: "Shows information about something from MDN!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "query",
					description: "Query to search from MDN",
					required: true,
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const url = "https://mdn.gideonbot.com/embed?q=";
		const query = encodeURIComponent(
			command.options.getString("query", true)
		);

		const data = await (await request(`${url}${query}`)).body.json();
		if (data.code && data.code === 404) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");

			const text = lang.ERRORS.NOT_FOUND("MDN");
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

		data.color = Util.resolveColor(data.color);
		const embed = new EmbedBuilder(data);

		return command.reply({
			embeds: [embed],
		});
	}
}
