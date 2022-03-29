import {
	ButtonInteraction,
	ComponentType,
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	Util,
} from "discord.js";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";

const IDS = new Set();

export = async (
	msg: Message,
	message: Message,
	lang: typeof import("@locales/English").default
) => {
	const opponent = message.mentions.users.first();
	const acceptText = lang.GAMES.RPS.WAITING_FOR_OPPONENT(opponent.toString());
	const footer = lang.GAMES.RPS.FOOTER;
	const AcceptEmbed = new EmbedBuilder()
		.setColor(Util.resolveColor("Blurple"))
		.setAuthor({
			name: message.author.username,
			iconURL: message.author.displayAvatarURL(),
		})
		.setDescription(bold(acceptText))
		.setFooter({
			text: footer,
		})
		.setTimestamp();

	const AcceptButton = new ButtonBuilder()
		.setStyle(3)
		.setCustomId("accept")
		.setLabel(lang.GLOBAL.ACCEPT)
		.setEmoji({ name: "✅" });

	const DeclineButton = new ButtonBuilder()
		.setStyle(4)
		.setCustomId("decline")
		.setLabel(lang.GLOBAL.DECLINE)
		.setEmoji({ name: "❌" });

	const ChooseRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		AcceptButton,
		DeclineButton
	);

	const reply = await msg.edit({
		content: lang.GAMES.RPS.ACCEPT_CHALLENGE(
			opponent.toString(),
			message.author.toString()
		),
		embeds: [AcceptEmbed.toJSON()],
		components: [ChooseRow],
	});

	const filter = (button) => button.user.id === opponent.id;
	const collector = await reply.createMessageComponentCollector({
		filter: filter,
		componentType: ComponentType.Button,
		time: 30000,
	});

	collector.on("collect", async (button: ButtonInteraction) => {
		if (button.customId === "decline") {
			await button.deferUpdate();

			return collector.stop("declined");
		}

		const content = lang.GAMES.RPS.VERSUS(
			opponent.toString(),
			message.author.toString()
		);
		await button.deferUpdate();

		const GameEmbed = new EmbedBuilder()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: message.author.username,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription(bold(content))
			.setFooter({
				text: footer,
			})
			.setTimestamp();

		const rock = new ButtonBuilder()
			.setStyle(2)
			.setCustomId("rock")
			.setLabel(lang.GAMES.RPS.ITEMS.ROCK)
			.setEmoji({ name: "🪨" });

		const paper = new ButtonBuilder()
			.setStyle(3)
			.setCustomId("paper")
			.setLabel(lang.GAMES.RPS.ITEMS.PAPER)
			.setEmoji({ name: "📄" });

		const scissors = new ButtonBuilder()
			.setStyle(4)
			.setCustomId("scissors")
			.setLabel(lang.GAMES.RPS.ITEMS.SCISSORS)
			.setEmoji({ name: "✂" });

		const ItemsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			rock,
			paper,
			scissors
		);

		await reply.edit({
			content: null,
			embeds: [GameEmbed.toJSON()],
			components: [ItemsRow],
		});

		collector.stop();

		IDS.add(message.author.id);
		IDS.add(opponent.id);

		let opponentChoose = "";
		let authorChoose = "";

		const SecondCollector = await reply.createMessageComponentCollector({
			filter: (btn) => IDS.has(btn.user.id),
			componentType: ComponentType.Button,
			time: 30000,
		});

		SecondCollector.on("collect", async (button_1: ButtonInteraction) => {
			await button_1.deferUpdate();

			if (button_1.user.id === message.author.id) {
				IDS.delete(button_1.user.id);
				authorChoose = button_1.customId;
			} else if (button_1.user.id !== message.author.id) {
				IDS.delete(button_1.user.id);
				opponentChoose = button_1.customId;
			}

			if (IDS.size === 0) {
				return SecondCollector.stop("results");
			}
		});

		SecondCollector.on("end", async (collected, reason) => {
			switch (reason) {
				case "time": {
					const OverContent = lang.GAMES.RPS.TIMEOUT;
					const OverEmbed = new EmbedBuilder()
						.setColor(Util.resolveColor("Blurple"))
						.setAuthor({
							name: message.author.username,
							iconURL: message.author.displayAvatarURL(),
						})
						.setDescription(bold(OverContent))
						.setFooter({
							text: footer,
						})
						.setTimestamp();

					reply.edit({
						embeds: [OverEmbed.toJSON()],
						components: [],
					});

					return;
				}

				case "results": {
					const winner = await GetWinner(
						opponentChoose,
						authorChoose
					);
					const winEmbed = new EmbedBuilder()
						.setColor(Util.resolveColor("Blurple"))
						.setAuthor({
							name: message.author.username,
							iconURL: message.author.displayAvatarURL(),
						})
						.setFooter({
							text: footer,
						})
						.setTimestamp();

					if (winner === "opponent") {
						const opponentWinContent = lang.GAMES.RPS.FINAL(
							opponent.toString()
						);
						winEmbed.setDescription(bold(opponentWinContent));

						reply.edit({
							embeds: [winEmbed.toJSON()],
							components: [],
						});
						return;
					} else if (winner === "author") {
						const authorWinContent = lang.GAMES.RPS.FINAL(
							message.author.toString()
						);
						winEmbed.setDescription(bold(authorWinContent));

						reply.edit({
							embeds: [winEmbed.toJSON()],
							components: [],
						});

						return;
					} else if (winner === "draw") {
						const WinContent = lang.GAMES.RPS.DRAW;
						winEmbed.setDescription(`**${WinContent}**`);

						reply.edit({
							embeds: [winEmbed.toJSON()],
							components: [],
						});

						return;
					}
				}
			}
		});
	});

	collector.on("end", async (collected, reason) => {
		if (reason === "time") {
			const noAnswerContent = lang.GAMES.RPS.NO_ANSWER(
				opponent.toString()
			);

			const noAnswerEmbed = new EmbedBuilder()
				.setColor(Util.resolveColor("Blurple"))
				.setAuthor({
					name: message.author.username,
					iconURL: message.author.displayAvatarURL(),
				})
				.setDescription(bold(noAnswerContent))
				.setFooter({
					text: footer,
				})
				.setTimestamp();

			reply.edit({
				embeds: [noAnswerEmbed.toJSON()],
				components: [],
				content: null,
			});

			return;
		} else if (reason === "declined") {
			const DeclinedContent = lang.GAMES.RPS.DECLINED(
				opponent.toString()
			);

			const DeclinedEmbed = new EmbedBuilder()
				.setColor(Util.resolveColor("Blurple"))
				.setAuthor({
					name: message.author.username,
					iconURL: message.author.displayAvatarURL(),
				})
				.setDescription(bold(DeclinedContent))
				.setFooter({
					text: footer,
				})
				.setTimestamp();

			reply.edit({
				embeds: [DeclinedEmbed.toJSON()],
				components: [],
				content: null,
			});

			return;
		}
	});
};

function GetWinner(
	opChoose: string,
	authorChoose: string
): "opponent" | "author" | "draw" {
	let winner: "opponent" | "author" | "draw";

	if (opChoose === "rock" && authorChoose === "scissors") {
		winner = "opponent";
	} else if (opChoose === "scissors" && authorChoose === "rock") {
		winner = "author";
	}

	if (opChoose === "scissors" && authorChoose === "paper") {
		winner = "opponent";
	} else if (opChoose === "paper" && authorChoose === "scissors") {
		winner = "author";
	}

	if (opChoose === "paper" && authorChoose === "rock") {
		winner = "opponent";
	} else if (opChoose === "rock" && authorChoose === "paper") {
		winner = "author";
	}

	if (opChoose === authorChoose) {
		winner = "draw";
	}

	return winner;
}
