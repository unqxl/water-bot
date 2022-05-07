import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { bold, time } from "@discordjs/builders";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { SubCommand } from "../../types/Command/SubCommand";
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
		lang: LanguageService
	) {
		const service = new GuildService(this.client);
		const locale = await service.getSetting(command.guildId, "locale");

		const username = command.options.getString("username", true);
		const mode = command.options.getString("mode") as OsuModes;

		const data = await this.client.apis.osu.getUserData(username, mode);
		if (data["error"] && data["error"] === null) {
			const author = this.client.functions.author(command.member);
			const color = this.client.functions.color("Red");
			const text = await lang.get("ERRORS:DATA_NOT_FOUND", "osu!api");

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
			: await lang.get("OTHER:NONE");

		const color = this.client.functions.color("Blurple");
		const { OSU } = await (await lang.all()).OTHER_COMMANDS;

		const last_visit = new Date(data.last_visit);
		const lvf = last_visit.toLocaleString(locale);
		const lt = time(last_visit, "R");

		const res = [
			`› ${bold(OSU.STATISTICS)}:`,
			`» ${bold(OSU.LEVEL)}: ${bold(current.toLocaleString("be"))}`,
			`» ${bold(OSU.ACCURACY)}: ${bold(hit_accuracy.toFixed(2))}`,
			`» ${bold(OSU.PP)}: ${bold(pp.toLocaleString("be"))}`,
			`» ${bold(OSU.RANKED_SCORE)}: ${bold(rs.toLocaleString("be"))}`,
			`» ${bold(OSU.PLAYCOUNT)}: ${bold(pc.toLocaleString("be"))}`,
			`» ${bold(OSU.MAX_COMBO)}: ${bold(pc.toLocaleString("be"))}`,
			`» ${bold(OSU.PLAYSTYLE)}: ${bold(playstyle)}`,
			`» ${bold(OSU.RANK)}: ${bold(gr.toLocaleString("be"))}`,
			`» ${bold(OSU.COUNTRY_RANK)}: ${bold(cr.toLocaleString("be"))}`,
			`» ${bold(OSU.COUNTRY)}: ${bold(country.name)}`,
			`» ${bold(OSU.LAST_VISIT)}: ${bold(lvf + ` (${lt})`)}`,
			"",
			`› ${bold(OSU.GRADES)}:`,
			`» ${bold(OSU.SSH)}: ${bold(ssh.toLocaleString("be"))}`,
			`» ${bold(OSU.SS)}: ${bold(ss.toLocaleString("be"))}`,
			`» ${bold(OSU.SH)}: ${bold(sh.toLocaleString("be"))}`,
			`» ${bold(OSU.S)}: ${bold(s.toLocaleString("be"))}`,
			`» ${bold(OSU.A)}: ${bold(a.toLocaleString("be"))}`,
			"",
			`› ${bold(OSU.OTHER_USERNAMES)}:`,
			`${bold(previous_usernames.join(", "))}`,
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
