import {
	Categories,
	ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class TwitchStreamersRemoveCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "twitchstreamers-remove",
			aliases: ["ts-remove"],

			description: {
				en: "Deletes Twitch Streamer from Twitch Notifications DB!",
				ru: "Удаляет Twitch Стримера с Базы Twitch Уведомлений!",
			},

			category: Categories.SETTINGS,
			usage: "<prefix>twitchstreamers-remove <streamer>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const status = this.client.database.getSetting(
			message.guild,
			"twitchEnabled"
		);
		if (status === "0") {
			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_ENABLED;
			const text = lang.ERRORS.SYSTEM_NOT_ENABLED(type);
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

		const channelID = this.client.database.getSetting(
			message.guild,
			"twitchChannelID"
		);
		if (channelID === "0") {
			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_CHANNEL;
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

		const channel = args[0];
		if (!channel) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"twitchstreamers-remove"
			);
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
		const channel = args[0];
		const streamers = this.client.database.getSetting(
			message.guild,
			"twitchStreamers"
		);
		const streamer = streamers.find(
			(streamer) => streamer.name === channel
		);

		if (!streamer) {
			const text = lang.ERRORS.MISSING_IN_LIST(
				channel,
				streamers.map((x) => x.name).join(", ")
			);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		streamers.filter((streamer) => streamer.name !== channel);
		this.client.database.set(message.guild, "twitchStreamers", streamers);

		const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_CHANNEL;
		const text = lang.SETTINGS.DELETED(type, streamer);
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
