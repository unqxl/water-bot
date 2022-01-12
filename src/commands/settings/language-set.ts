import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold, inlineCode } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class LanguageSetCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "language-set",

			description: {
				en: "Sets new Server Language!",
				ru: "Ставит новый Язык для Сервера!",
			},

			usage: "<prefix>language-set <language>",
			category: Categories.SETTINGS,
			memberPermissions: ["ADMINISTRATOR"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const language = args[0];
		const supported = this.client.config.languages;

		if (!language) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"language-set"
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

		if (!supported.includes(language)) {
			const text = lang.ERRORS.MISSING_IN_LIST(
				language,
				supported.join(", ")
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

		return {
			ok: true,
		};
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const language = args[0];
		const note = lang.SETTINGS.LANGUAGE_CHANGED_NOTE;

		var newLanguage = "";

		if (language === "ru") newLanguage = "ru-RU";
		if (language === "en") newLanguage = "en-US";

		if (language === "ru-RU") newLanguage = "ru-RU";
		if (language === "en-US") newLanguage = "en-US";

		this.client.database.set(message.guild, "language", newLanguage);

		const text = lang.SETTINGS.SETTED(
			language === "en-US" ? "Language" : "Язык",
			language === "en-US" ? "English" : "Русский"
		);
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			`${bold(text)}\n\n${inlineCode(note)}`,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
