import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class LogsChannelCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "logschannel",
			aliases: ["lc"],

			description: {
				en: "Shows/Sets/Removes Server's Logs Channel!",
				ru: "Показывает/Ставит/Удаляет Канал для Логов Сервера!",
			},

			usage: "<prefix>logschannel <show|set|reset> [channel]",
			category: Categories.SETTINGS,
			memberPermissions: ["Administrator"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const config = await this.client.database.getGuild(message.guild.id);

		var actions = ["show", "set", "reset"];
		var action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			var channel = config.log_channel;

			if (!channel) channel = lang.GLOBAL.NONE;
			else channel = message.guild.channels.cache.get(channel).toString();

			const type = lang.SETTINGS.CONFIG.TYPES.LOG_CHANNEL;
			const text = lang.SETTINGS.SHOW(type, channel);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✉️",
				true
			);

			return message.channel.send({
				embeds: [embed.json],
			});
		} else if (action === "set") {
			const channel =
				message.mentions.channels.first() ||
				message.guild.channels.cache.get(args[1]);

			if (!channel) {
				const text = lang.ERRORS.ARGS_MISSING("logschannel");
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.json],
				});
			}

			await this.client.database.set(
				message.guild.id,
				"log_channel",
				channel.id
			);

			const type = lang.SETTINGS.CONFIG.TYPES.LOG_CHANNEL;
			const text = lang.SETTINGS.SETTED(type, channel.toString());
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
		} else if (action === "reset") {
			await this.client.database.set(
				message.guild.id,
				"log_channel",
				null
			);

			const type = lang.SETTINGS.CONFIG.TYPES.LOG_CHANNEL;
			const text = lang.SETTINGS.RESETTED(type);
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
}
