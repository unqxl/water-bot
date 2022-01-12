import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class TwitchSystemDisableCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "twitchsystem-disable",
			aliases: ["twitch-disable"],

			description: {
				en: "Disables Twitch Notifications System!",
				ru: "Выключает Систему Twitch Уведомлений!",
			},

			category: Categories.SETTINGS,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		await this.client.database.set(message.guild, "twitchEnabled", "0");

		const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_ENABLED;
		const text = lang.SETTINGS.DISABLED(type);
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
