import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class LocaleCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "locale",
			aliases: ["l"],

			description: {
				en: "Shows/Changes Server's Language!",
				ru: "Показывает/Меняет Язык Сервера!",
			},

			usage: "<prefix>locale <show|set|reset> [ru|en]",
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
			const locale = config.locale;
			const type = lang.SETTINGS.CONFIG.TYPES.LANGUAGE;
			const text = lang.SETTINGS.SHOW(type, locale);
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
			const locale = args[1];

			if (!locale) {
				const text = lang.ERRORS.ARGS_MISSING("locale");
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

			if (!this.client.config.languages.includes(locale)) {
				const text = lang.ERRORS.MISSING_IN_LIST(
					locale,
					this.client.config.languages.join(", ")
				).replace("{cmd_name}", "locale");
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
				"locale",
				locale === "en" || locale === "en-US" ? "en-US" : "ru-RU"
			);

			const type = lang.SETTINGS.CONFIG.TYPES.LANGUAGE;
			const text = lang.SETTINGS.SETTED(
				type,
				locale === "en" || locale === "en-US" ? "English" : "Русский"
			);
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
			await this.client.database.set(message.guild.id, "locale", "ru-RU");

			const type = lang.SETTINGS.CONFIG.TYPES.LANGUAGE;
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
