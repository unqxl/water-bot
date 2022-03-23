import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class TwitchSystemCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "twitchsystem",
			aliases: ["twc"],

			description: {
				en: "Enables/Disables Twitch Notification System!",
				ru: "Включает/Выключает Систему Twitch Уведомлений!",
			},

			usage: "<prefix>twitchsystem <enable|disable>",
			category: Categories.SETTINGS,
			memberPermissions: ["Administrator"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const config = this.client.configurations.get(message.guild.id);

		var actions = ["enable", "disable"];
		var action = args[0];

		if (!action)
			action = config.twitchSystem === true ? "disable" : "enable";
		if (!actions.includes(action))
			config.twitchSystem === true ? "disable" : "enable";

		if (action === "enable") {
			config.twitchSystem = true;
			await this.client.configurations.set(message.guild.id, config);

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_SYSTEM;
			const text = lang.SETTINGS.ENABLED(type);
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
		} else if (action === "disable") {
			config.twitchSystem = false;
			await this.client.configurations.set(message.guild.id, config);

			const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_SYSTEM;
			const text = lang.SETTINGS.DISABLED(type);
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
