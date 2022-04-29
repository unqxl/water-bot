import { Attachment } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { Rank } from "canvacord";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class RankCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "rank",
			aliases: ["card"],

			description: {
				en: "Displays a Card with Your Leveling Info!",
				ru: "Показывает Карточку с Вашей Статистикой Уровней!",
			},

			category: Categories.LEVELING,
			usage: "<prefix>rank [member]",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.member;

		const { level, xp } = this.client.levels.getData(
			message.guild.id,
			member.id
		);
		const requiredXP = this.client.levels.xpForNextLevel(
			message.guild.id,
			member.id
		);
		const rank = this.client.levels.getRank(message.guild.id, member.id);

		const card = new Rank()
			.setAvatar(member.user.displayAvatarURL({ extension: "png" }))
			.setUsername(member.user.username)
			.setDiscriminator(member.user.discriminator)
			.renderEmojis(true)
			.setRank(rank)
			.setLevel(level)
			.setCurrentXP(xp)
			.setRequiredXP(requiredXP)
			.setProgressBar(["#aab6fb", "#6096fd"], "GRADIENT");

		return await card
			.build({
				fontX: "Sans",
				fontY: "Sans",
			})
			.then(async (data) => {
				const attachment = new Attachment(data, "rank.png");

				return message.channel.send({
					files: [attachment],
				});
			});
	}
}
