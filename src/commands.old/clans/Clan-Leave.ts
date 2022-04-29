import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { GuildClan } from "../../interfaces/Clans";
import Bot from "../../classes/Bot";

export default class ClanLeaveCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "clan-leave",

			description: {
				en: "Allows You to join Clan from the Guild!",
				ru: "Позволяет вам выйти из Клана!",
			},

			category: Categories.CLANS,
			usage: "<prefix>clan-leave",
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
					embeds: [embed.data.toJSON()],
				},
			};
		}

		const memberClan = data.find((x) =>
			x.members.includes(message.author.id)
		);

		if (!memberClan) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				lang.SYSTEMS.CLANS.ERRORS.NOT_IN_CLAN,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.data.toJSON()],
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
		const data = (await this.client.clans.list(
			message.guild.id
		)) as GuildClan[];

		const memberClan = data.find((x) =>
			x.members.includes(message.author.id)
		);

		await this.client.clans.leaveClan(
			memberClan.owner,
			message.guild.id,
			message.author.id
		);

		const text = lang.SYSTEMS.CLANS.RESULTS.LEFT(memberClan.name);
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.data.toJSON()],
		});
	}
}
