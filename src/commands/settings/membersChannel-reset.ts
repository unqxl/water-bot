import {
	Categories,
	ValidateReturn,
} from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class MembersChannelResetCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "memberschannel-reset",
			aliases: ["mc-reset"],

			description: {
				en: "Deletes Members Channel from Server DB!",
				ru: "Удаляет Канал для Участников с Базы Сервера!",
			},

			category: Categories.SETTINGS,
			memberPermissions: ["ADMINISTRATOR"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const channel = this.client.database.getSetting(
			message.guild,
			"membersChannel"
		);

		if (channel === "0") {
			const type = lang.SETTINGS.CONFIG.TYPES.MEMBERS_CHANNEL;
			const text = lang.ERRORS.MISSING_IN_DB(type);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
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
		this.client.database.set(message.guild, "membersChannel", "0");

		const type = lang.SETTINGS.CONFIG.TYPES.MEMBERS_CHANNEL;
		const text = lang.SETTINGS.RESETTED(type);
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
