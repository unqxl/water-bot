import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class TwitchSystemEnableCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "twitchsystem-enable",
			aliases: ["twitch-enable"],

			description: {
				en: "Enables Twitch Notifications System!",
				ru: "Включает Систему Twitch Уведомлений!",
			},

			category: Categories.SETTINGS,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		await this.client.database.set(message.guild, "twitchEnabled", "1");

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
