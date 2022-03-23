import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import Bot from "../../classes/Bot";

export default class ClanJoinCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "clan-join",

			description: {
				en: "Allows You to join Clan from the Guild!",
				ru: "Позволяет вам войти в Клан!",
			},

			category: Categories.CLANS,
			usage: "<prefix>clan-join <abr>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const data = await this.client.clans.list(message.guild.id);
		if ("message" in data) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				data.message,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.json],
				},
			};
		}

		const abr = args[0];
		if (!abr) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				lang.ERRORS.ARGS_MISSING("clan-join"),
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.json],
				},
			};
		}

		return { ok: true };
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const abr = args[0];
		const data = await this.client.clans.joinClan(
			abr,
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

		const text = lang.SYSTEMS.CLANS.RESULTS.JOINED(data.name);
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.json],
		});
	}
}
