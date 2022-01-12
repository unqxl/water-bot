import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class TwitchChannelCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "twitchchannel",
			aliases: ["tc"],

			description: {
				en: "Shows/Sets/Removes Server's Twitch Notifications Channel!",
				ru: "Показывает/Ставит/Удаляет Канал для Twitch Уведомлений Сервера!",
			},

			usage: "<prefix>twitchchannel <show|set|reset> [role]",
			category: Categories.SETTINGS,
			memberPermissions: ["ADMINISTRATOR"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		var actions = ["show", "set", "reset"];
		var action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			var channel = this.client.database.getSetting(
				message.guild,
				"twitchChannelID"
			);

			if (channel === "0") channel = lang.GLOBAL.NONE;
			else channel = message.guild.channels.cache.get(channel).toString();

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_CHANNEL;
			const text = lang.SETTINGS.SHOW(type, channel);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				false,
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		} else if (action === "set") {
			const channel =
				message.mentions.channels.first() ||
				message.guild.channels.cache.get(args[1]);

			if (!channel) {
				const text = lang.ERRORS.ARGS_MISSING.replace(
					"{cmd_name}",
					"twitchchannel"
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

			this.client.database.set(
				message.guild,
				"twitchСhannelID",
				channel.id
			);

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_CHANNEL;
			const text = lang.SETTINGS.SETTED(type, channel.toString());
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
		} else if (action === "reset") {
			this.client.database.set(message.guild, "twitchChannelID", "0");

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_CHANNEL;
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
}
