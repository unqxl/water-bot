import { bold, inlineCode } from "@discordjs/builders";
import { EmbedBuilder, Util } from "discord.js";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";

export default class LeaderboardCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "leaderboard",
			aliases: ["lb"],

			description: {
				en: "Displays Guild Leveling Leaderboard!",
				ru: "Выводит Серверную Таблицу Лидеров по Уровню!",
			},

			category: Categories.LEVELING,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const leaderboard = this.client.levels.leaderboard(message.guild.id);
		const userData = this.client.levels.getData(
			message.guild.id,
			message.author.id
		);
		const userPlace = this.client.levels
			.getRank(message.guild.id, message.author.id)
			.toLocaleString();

		const userLevel = this.client.functions.sp(userData.level);
		const userXP = this.client.functions.sp(userData.xp);

		let content = "";
		const additionalContent = `\n————————————————————————\n[${inlineCode(
			`#${userPlace}`
		)}] ${message.author.toString()} (${bold(
			`${userLevel} LVL | ${userXP} XP`
		)})`;

		for (const leader of leaderboard) {
			const member =
				message.guild.members.cache.get(leader.userID) ||
				"Deleted User";
			const place = leader.place.toLocaleString();
			const level = leader.level.toLocaleString();
			const xp = leader.xp.toLocaleString();

			content += `[${inlineCode(
				`#${place}`
			)}] ${member.toString()} (${bold(`${level} LVL | ${xp} XP`)})\n`;
		}

		const embed = new EmbedBuilder()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: message.guild.name,
				iconURL: message.guild.iconURL(),
			})
			.setDescription(content + additionalContent)
			.setTimestamp();

		return message.channel.send({
			embeds: [embed.toJSON()],
		});
	}
}
