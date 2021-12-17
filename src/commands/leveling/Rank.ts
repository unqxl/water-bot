import { Message, MessageAttachment } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { Rank } from "canvacord";
import Goose from "../../classes/Goose";

export default class RankCommand extends Command {
	constructor(client: Goose) {
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
			.setAvatar(
				member.user.displayAvatarURL({ dynamic: false, format: "png" })
			)
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
				const attachment = new MessageAttachment(data, "rank.png");

				return message.channel.send({
					files: [attachment],
				});
			});
	}
}
