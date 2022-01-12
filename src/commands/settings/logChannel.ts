import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class LogChannelCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "logchannel",
			aliases: ["lc"],

			description: {
				en: "Shows/Sets/Removes Server's Log Channel!",
				ru: "Показывает/Ставит/Удаляет Канал для Логов Сервера!",
			},

			usage: "<prefix>logchannel <show|set|reset> [role]",
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
				"logChannel"
			);

			if (channel === "0") channel = lang.GLOBAL.NONE;
			else channel = message.guild.channels.cache.get(channel).toString();

			const type = lang.SETTINGS.CONFIG.TYPES.LOG_CHANNEL;
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
					"logchannel"
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

			this.client.database.set(message.guild, "logChannel", channel.id);

			const type = lang.SETTINGS.CONFIG.TYPES.LOG_CHANNEL;
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
			this.client.database.set(message.guild, "logChannel", "0");

			const type = lang.SETTINGS.CONFIG.TYPES.LOG_CHANNEL;
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
