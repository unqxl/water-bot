import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class TwitchStreamersAddCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "twitchstreamers-add",
			aliases: ["ts-add"],

			description: {
				en: "Adds Twitch Streamer to Twitch Notifications DB!",
				ru: "Добавляет Twitch Стримера в Базу Twitch Уведомлений!",
			},

			category: Categories.SETTINGS,
			usage: "<prefix>twitchstreamers-add <streamer>",
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
				"twitchstreamers-add"
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

		const streamers = this.client.database.getSetting(
			message.guild,
			"twitchStreamers"
		);
		const streamer = streamers.find((x) => x.name === channel);
		if (streamer) {
			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_STREAMERS;
			const text = lang.ERRORS.ALREADY_IN_DB(type, channel);
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

		streamers.push({
			name: channel,
			latestStream: null,
		});

		this.client.database.set(message.guild, "twitchStreamers", streamers);

		const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_STREAMERS;
		const text = lang.SETTINGS.ADDED(type, channel);
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
