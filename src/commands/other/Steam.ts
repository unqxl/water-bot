import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Embed, Message, Util } from "discord.js";
import { Command } from "../../types/Command/Command";
import Bot from "../../classes/Bot";
import { bold } from "@discordjs/builders";

export default class SteamCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "steam",

			description: {
				en: "Shows Game Information!",
				ru: "Показывает информацию игры!",
			},

			category: Categories.OTHER,
			usage: "<prefix>steam <name>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const name = args.join(" ");
		if (!name) {
			const text = lang.ERRORS.ARGS_MISSING("steam");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
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
		const locale = await this.client.database.getSetting(
			message.guild.id,
			"locale"
		);

		const l = locale === "en-US" ? "en" : "ru";
		const name = args.join(" ");
		const { success, data } = await this.client.apis.steam.getAppInfo(
			name,
			l
		);

		const app_url = this.client.apis.steam.getStoreAppLink(
			data.steam_appid
		);

		if (!success) {
			const text = lang.ERRORS.NOT_FOUND("Steam API");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const embed = new Embed();
		embed.setColor(Util.resolveColor("Blurple"));
		embed.setAuthor({
			name: message.author.username,
			iconURL: message.author.displayAvatarURL(),
		});
		embed.setTitle(data.name);
		embed.setURL(data.website ?? app_url);
		embed.setImage(data.header_image ?? null);

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.ABOUT,
			value: bold(data.about_the_game),
			inline: false,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.LANGUAGES,
			value: bold(
				data.supported_languages
					.replaceAll("<strong>", "")
					.replaceAll("</strong>", "")
					.replaceAll("<br>", "\n")
			),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.DEVELOPERS,
			value: bold(data.developers.join(", ")),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.PLATFORMS,
			value: [
				`› ${bold(lang.OTHER.STEAM.PLATFORMS.WINDOWS)}: ${
					data.platforms.windows === true
						? bold(lang.GLOBAL.YES)
						: bold(lang.GLOBAL.NO)
				}`,
				`› ${bold(lang.OTHER.STEAM.PLATFORMS.MACOS)}: ${
					data.platforms.mac === true
						? bold(lang.GLOBAL.YES)
						: bold(lang.GLOBAL.NO)
				}`,
				`› ${bold(lang.OTHER.STEAM.PLATFORMS.LINUX)}: ${
					data.platforms.linux === true
						? bold(lang.GLOBAL.YES)
						: bold(lang.GLOBAL.NO)
				}`,
			].join("\n"),
			inline: false,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.CATEGORIES,
			value: bold(data.categories.map((c) => c.description).join(", ")),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.GENRES,
			value: bold(data.genres.map((c) => c.description).join(", ")),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.RECOMENDATIONS,
			value: bold(data.recommendations.total.toLocaleString("be")),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.RELEASE_DATE,
			value: [
				`› ${bold(lang.OTHER.STEAM.COMING_SOON)}: ${
					data.release_date.coming_soon === true
						? bold(lang.GLOBAL.YES)
						: bold(lang.GLOBAL.NO)
				}`,
				`› ${bold(lang.OTHER.STEAM.DATE)}: ${bold(
					data.release_date.date
				)}`,
			].join("\n"),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.PRICE,
			value: [
				`› ${bold(lang.OTHER.STEAM.PRICE)}: ${bold(
					data.price_overview.final_formatted
				)}`,
				`› ${bold(lang.OTHER.STEAM.DISCOUNT)}: ${bold(
					data.price_overview.discount_percent.toString() + "%"
				)}`,
			].join("\n"),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.STEAM.FIELDS.NOTES,
			value:
				typeof data.content_descriptors.notes === "string"
					? bold(data.content_descriptors.notes)
					: bold(lang.GLOBAL.NONE),
			inline: true,
		});

		return message.channel.send({
			embeds: [embed],
		});
	}
}
