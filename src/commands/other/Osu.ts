import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold, time } from "@discordjs/builders";
import Bot from "../../classes/Bot";

type OsuModes = "osu" | "fruits" | "mania" | "taiko";

export default class osuCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "osu",
			description: "Shows profile statistics of osu!user",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "username",
					description: "osu!profile username",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "mode",
					description: "osu!mode",
					required: false,
					choices: [
						{
							name: "osu!standart",
							value: "osu",
						},
						{
							name: "Catch The Beat",
							value: "fruits",
						},
						{
							name: "osu!mania",
							value: "mania",
						},
						{
							name: "osu!taiko",
							value: "taiko",
						},
					],
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const locale =
			(await this.client.database.getSetting(
				command.guildId,
				"locale"
			)) == "en-US"
				? "en"
				: "ru";

		const username = command.options.getString("username", true);
		const mode = command.options.getString("mode") as OsuModes;

		const data = await this.client.apis.osu.getUserData(username, mode);
		if (data["error"] && data["error"] === null) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");

			const text = lang.ERRORS.NOT_FOUND("osu!users API");
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

			return command.reply({
				ephemeral: true,
				embeds: [embed],
			});
		}

		const {
			statistics: {
				level: { current },
				hit_accuracy,
				ranked_score: rs,
				grade_counts: { ssh, ss, sh, s, a },
				country_rank: cr,
				global_rank: gr,
				play_count: pc,
				pp,
			},
			previous_usernames,
			playstyle: ps,
			country,
		} = data;

		const playstyle = ps
			? ps
					.map(
						(style) =>
							style.charAt(0).toUpperCase() + style.slice(1)
					)
					.join(", ")
			: lang.GLOBAL.NONE;

		const color = this.client.functions.color("Blurple");
		const pack = lang.OTHER.OSU;

		const last_visit = new Date(data.last_visit);
		const lvf = last_visit.toLocaleString(locale);
		const lt = time(last_visit, "R");

		const res = [
			`› ${bold(pack.FIELDS.STATISTICS)}:`,
			`» ${bold(pack.LEVEL)}: ${bold(current.toLocaleString("be"))}`,
			`» ${bold(pack.ACCURACY)}: ${bold(hit_accuracy.toFixed(2))}`,
			`» ${bold(pack.PP)}: ${bold(pp.toLocaleString("be"))}`,
			`» ${bold(pack.RANKED_SCORE)}: ${bold(rs.toLocaleString("be"))}`,
			`» ${bold(pack.PLAYCOUNT)}: ${bold(pc.toLocaleString("be"))}`,
			`» ${bold(pack.MAX_COMBO)}: ${bold(pc.toLocaleString("be"))}`,
			`» ${bold(pack.PLAYSTYLE)}: ${bold(playstyle)}`,
			`» ${bold(pack.RANK)}: ${bold(gr.toLocaleString("be"))}`,
			`» ${bold(pack.COUNTRY_RANK)}: ${bold(cr.toLocaleString("be"))}`,
			`» ${bold(pack.COUNTRY)}: ${bold(country.name)}`,
			`» ${bold(pack.LAST_VISIT)}: ${bold(lvf + ` (${lt})`)}`,
			"",
			`› ${bold(pack.FIELDS.GRADES)}:`,
			`» ${bold(pack.GRADES.SSH)}: ${bold(ssh.toLocaleString("be"))}`,
			`» ${bold(pack.GRADES.SS)}: ${bold(ss.toLocaleString("be"))}`,
			`» ${bold(pack.GRADES.SH)}: ${bold(sh.toLocaleString("be"))}`,
			`» ${bold(pack.GRADES.S)}: ${bold(s.toLocaleString("be"))}`,
			`» ${bold(pack.GRADES.A)}: ${bold(a.toLocaleString("be"))}`,
			"",
			`› ${bold(pack.FIELDS.OTHER_USERNAMES)}:`,
			bold(previous_usernames.join(", ")),
		].join("\n");

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor({
			name: data.username,
			iconURL: data.avatar_url,
		});
		embed.setTitle(data.username);
		embed.setURL("https://osu.ppy.sh/users/" + data.id);
		embed.setThumbnail(data.avatar_url);
		embed.setImage(data.cover_url);
		embed.setDescription(res);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
