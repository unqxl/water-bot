import { Embed, Message, Util } from "discord.js";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class OsuCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "osu",

			description: {
				en: "Shows osu!user profile statistics!",
				ru: "Показывает статистику профиля osu! игрока!",
			},

			category: Categories.OTHER,
			usage: "<prefix>osu <profile_name> [mode]",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const name = args.join(" ");
		if (!name) {
			const text = lang.ERRORS.ARGS_MISSING("osu");
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
		const mode = "osu";

		const data = await this.client.apis.osu.getUserData(name, mode);
		if (data["error"] && data["error"] === null) {
			const name = args.join(" ");
			if (!name) {
				const text = lang.ERRORS.NOT_FOUND("osu!users API");
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

			return {
				ok: true,
			};
		}

		const embed = new Embed()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: data.username,
				iconURL: data.avatar_url,
			})
			.setThumbnail(data.avatar_url)
			.setImage(data.cover_url)
			.setTitle(data.username)
			.setURL("https://osu.ppy.sh/users/" + data.id);

		embed.addField({
			name: lang.OTHER.OSU.FIELDS.STATISTICS,
			value: [
				`› ${bold(lang.OTHER.OSU.LEVEL)}: ${bold(
					data.statistics.level.current.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.ACCURACY)}: ${bold(
					data.statistics.hit_accuracy.toFixed(2)
				)}`,
				`› ${bold(lang.OTHER.OSU.LEVEL)}: ${bold(
					data.statistics.level.current.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.PP)}: ${bold(
					data.statistics.pp.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.PLAYSTYLE)}: ${bold(
					data.playstyle
						.map(
							(style) =>
								style.charAt(0).toUpperCase() + style.slice(1)
						)
						.join(", ")
				)}`,
				`› ${bold(lang.OTHER.OSU.PLAYCOUNT)}: ${bold(
					data.statistics.play_count.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.MAX_COMBO)}: ${bold(
					data.statistics.maximum_combo.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.RANK)}: ${bold(
					data.statistics.global_rank.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.COUNTRY)}: ${bold(data.country.name)}`,
				`› ${bold(lang.OTHER.OSU.COUNTRY_RANK)}: ${bold(
					data.statistics.country_rank.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.RANKED_SCORE)}: ${bold(
					data.statistics.ranked_score.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.LAST_VISIT)}: ${bold(
					new Date(data.last_visit).toLocaleString(l)
				)}`,
			].join("\n"),
		});

		embed.addField({
			name: lang.OTHER.OSU.FIELDS.GRADES,
			value: [
				`› ${bold(lang.OTHER.OSU.GRADES.SSH)}: ${bold(
					data.statistics.grade_counts.ssh.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.GRADES.SS)}: ${bold(
					data.statistics.grade_counts.ss.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.GRADES.SH)}: ${bold(
					data.statistics.grade_counts.sh.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.GRADES.S)}: ${bold(
					data.statistics.grade_counts.s.toLocaleString("be")
				)}`,
				`› ${bold(lang.OTHER.OSU.GRADES.A)}: ${bold(
					data.statistics.grade_counts.a.toLocaleString("be")
				)}`,
			].join("\n"),
			inline: true,
		});

		embed.addField({
			name: lang.OTHER.OSU.FIELDS.OTHER_USERNAMES,
			value: bold(data.previous_usernames.join(", ")),
			inline: true,
		});

		return message.channel.send({
			embeds: [embed],
		});
	}
}
