import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class TwitchStreamersCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "twitchstreamers",
			aliases: ["twitch-s"],

			description: {
				en: "Shows/Adds/Removes Server's Twitch Streamer!",
				ru: "Показывает/Добавляет/Удаляет Канал для Уведомлений Twitch Сервера!",
			},

			usage: "<prefix>twitchstreamers <show|add|delete> [channel]",
			category: Categories.SETTINGS,
			memberPermissions: ["Administrator"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const config = await this.client.configurations.get(message.guild.id);

		const actions = ["show", "set", "delete"];
		let action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			const channels = config.twitchStreamers.length
				? config.twitchStreamers.map((c) => c.name).join(", ")
				: lang.GLOBAL.NONE;

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_STREAMERS;
			const text = lang.SETTINGS.SHOW(type, channels);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✉️",
				true
			);

			return message.channel.send({
				embeds: [embed.data.toJSON()],
			});
		} else if (action === "add") {
			const channel = args.join(" ");
			if (!channel) {
				const text = lang.ERRORS.ARGS_MISSING("twitchstreamers");
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

			if (config.twitchStreamers.find((c) => c.name === channel)) {
				const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_STREAMERS;
				const text = lang.ERRORS.ALREADY_IN_DB(channel, type);
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

			config.twitchStreamers.push({
				name: channel,
				latestStream: null,
			});

			await this.client.configurations.set(message.guild.id, config);

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_STREAMERS;
			const text = lang.SETTINGS.ADDED(type, channel);
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
		} else if (action === "delete") {
			const channel = args.join(" ");
			if (!channel) {
				const text = lang.ERRORS.ARGS_MISSING("twitchstreamers");
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

			if (config.twitchStreamers.find((c) => c.name === channel)) {
				const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_STREAMERS;
				const text = lang.ERRORS.NOT_FOUND_IN_DB(channel, type);
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

			config.twitchStreamers.filter((c) => c.name !== channel);
			await this.client.configurations.set(message.guild.id, config);

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_CHANNEL;
			const text = lang.SETTINGS.DELETED(type, channel.toString());
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
}
