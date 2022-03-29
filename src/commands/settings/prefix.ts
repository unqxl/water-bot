import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class PrefixCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "prefix",
			aliases: ["p", "pref"],

			description: {
				en: "Shows/Changes Server's Prefix!",
				ru: "Показывает/Меняет Префикс Сервера!",
			},

			usage: "<prefix>prefix <show|set|reset> [prefix]",
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

		const actions = ["show", "set", "reset"];
		let action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			const prefix = config.prefix;
			const type = lang.SETTINGS.CONFIG.TYPES.PREFIX;
			const text = lang.SETTINGS.SHOW(type, prefix);
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
		} else if (action === "set") {
			const prefix = args[1];
			if (!prefix) {
				const text = lang.ERRORS.ARGS_MISSING("prefix");
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

			await this.client.database.set(message.guild.id, "prefix", prefix);

			const type = lang.SETTINGS.CONFIG.TYPES.PREFIX;
			const text = lang.SETTINGS.SETTED(type, prefix);
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
		} else if (action === "reset") {
			await this.client.database.set(message.guild.id, "prefix", "-");

			const type = lang.SETTINGS.CONFIG.TYPES.PREFIX;
			const text = lang.SETTINGS.RESETTED(type, "-");
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
