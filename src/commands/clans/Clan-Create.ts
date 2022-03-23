import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";

export default class ClanCreateCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "clan-create",

			description: {
				en: "Allows You to create your own clan!",
				ru: "Позволяет вам создать собственный клан!",
			},

			category: Categories.CLANS,
			usage: "<prefix>clan-create",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const name = await this.client.functions.promptMessage(
			message,
			{
				embeds: [
					this.client.functions.buildEmbed(
						message,
						"Blurple",
						lang.SYSTEMS.CLANS.PROMPTS.WRITE_CLAN_NAME,
						false,
						"✉️",
						true
					).json,
				],
			},
			30000
		);

		if (!name) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				lang.SYSTEMS.CLANS.PROMPT_ERRORS.CLAN_NAME,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
			});
		}

		const abr = await this.client.functions.promptMessage(
			message,
			{
				embeds: [
					this.client.functions.buildEmbed(
						message,
						"Blurple",
						lang.SYSTEMS.CLANS.PROMPTS.WRITE_CLAN_ABR,
						false,
						"✉️",
						true
					).json,
				],
			},
			30000
		);

		if (!abr) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				lang.SYSTEMS.CLANS.PROMPT_ERRORS.CLAN_ABR,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
			});
		}

		const data = await this.client.clans.createClan(
			name as string,
			abr as string,
			message.guild.id,
			message.author.id
		);

		if ("message" in data) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				data.message,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
			});
		}

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			lang.SYSTEMS.CLANS.RESULTS.CREATED(name),
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.json],
		});
	}
}
