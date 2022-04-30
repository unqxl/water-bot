import {
	ActionRowBuilder,
	ButtonBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	GuildMember,
	Util,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { ValidateReturn } from "../../types/Command/BaseSlashCommand";
import { SubCommand } from "../../types/Command/SubCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class QueueCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "music",
			name: "queue",
			description: "Displays Current Music Queue!",
		});
	}

	async validate(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	): Promise<ValidateReturn> {
		const color = this.client.functions.color("Red");
		const author = this.client.functions.author(command.member);
		const { djRoles } = this.client.configurations.get(command.guild.id);
		if (djRoles.length) {
			const { status, message } = await this.client.DJSystem.check(
				command
			);
			if (!status) {
				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(message)}`);
				embed.setTimestamp();

				return {
					ok: false,
					error: {
						embeds: [embed],
					},
				};
			}
		}

		const voiceCheck = this.client.functions.voiceCheck(
			command.guild.me,
			command.member as GuildMember
		);
		if (!voiceCheck) {
			if (voiceCheck.code === 1) {
				const text = await lang.get("ERRORS:JOIN_VOICE");
				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(text)}`);
				embed.setTimestamp();

				return {
					ok: false,
					error: {
						embeds: [embed],
					},
				};
			} else if (voiceCheck.code === 2) {
				const text = await lang.get("ERRORS:JOIN_BOT_VOICE");
				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(text)}`);
				embed.setTimestamp();

				return {
					ok: false,
					error: {
						embeds: [embed],
					},
				};
			}
		}

		const queue = this.client.music.getQueue(command.guild);
		if (!queue) {
			const text = await lang.get("ERRORS:QUEUE_IS_EMPTY");
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`❌ | ${bold(text)}`);
			embed.setTimestamp();

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
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const queue = this.client.music.getQueue(command.guild);

		let i0 = 0;
		let i1 = 10;
		let page = 1;

		var description = queue.songs
			.map((v) => v)
			.map(({ name, user, formattedDuration }, i) => {
				const Name = Util.escapeMarkdown(name);
				const requestedBy = user.toString();
				const index = bold((i + 1).toString());
				const right_part = `[${formattedDuration} | ${requestedBy}]`;

				return `${index}: ${bold(Name)} ${bold(right_part)}`;
			})
			.slice(0, 10)
			.join("\n");

		const previousPage = new ButtonBuilder()
			.setStyle(2)
			.setEmoji({ name: "⬅️" })
			.setCustomId("previous");

		const nextPage = new ButtonBuilder()
			.setStyle(2)
			.setEmoji({ name: "➡️" })
			.setCustomId("next");

		const deletePage = new ButtonBuilder()
			.setStyle(2)
			.setEmoji({ name: "❌" })
			.setCustomId("delete");

		const row = new ActionRowBuilder<ButtonBuilder>();
		row.addComponents([previousPage, nextPage, deletePage]);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(description);
		embed.setFooter({
			text: `Page: ${page}/${Math.ceil(queue.songs.length / 10)}`,
		});
		embed.setTimestamp();

		await command.reply({
			components: [row],
			embeds: [embed],
		});

		const msg = await command.fetchReply();
		const collector = await msg.createMessageComponentCollector({
			filter: (btn) => btn.user.id === command.user.id,
			componentType: ComponentType.Button,
			time: 60 * 1000 * 5,
		});

		collector.on("collect", async (int) => {
			if (!int.isButton()) return;

			switch (int.customId) {
				case "previous": {
					i0 -= 10;
					i1 -= 10;
					page -= 1;

					if (i0 < 0) {
						collector.stop();

						int.update({
							components: [],
						});
						return;
					}

					description = queue.songs
						.map((v) => v)
						.map(({ name, user, formattedDuration }, i) => {
							const Name = Util.escapeMarkdown(name);
							const requestedBy = user.toString();
							const index = bold((i + 1).toString());
							const right_part = `[${formattedDuration} | ${requestedBy}]`;

							return `${index}: ${bold(Name)} ${bold(
								right_part
							)}`;
						})
						.slice(i0, i1)
						.join("\n");

					embed.setDescription(description);
					embed.setFooter({
						text: `Page: ${page}/${Math.ceil(
							queue.songs.length / 10
						)}`,
					});

					int.update({
						embeds: [embed.toJSON()],
					});
					return;
				}

				case "next": {
					i0 += 10;
					i1 += 10;
					page += 1;

					if (i1 > queue.songs.length) {
						collector.stop();

						int.update({
							components: [],
						});
						return;
					}

					if (!i0 || !i1) {
						collector.stop();

						int.update({
							components: [],
						});
						return;
					}

					description = queue.songs
						.map((v) => v)
						.map(({ name, user, formattedDuration }, i) => {
							const Name = Util.escapeMarkdown(name);
							const requestedBy = user.toString();
							const index = bold((i + 1).toString());
							const right_part = `[${formattedDuration} | ${requestedBy}]`;

							return `${index}: ${bold(Name)} ${bold(
								right_part
							)}`;
						})
						.slice(i0, i1)
						.join("\n");

					embed.setDescription(description);
					embed.setFooter({
						text: `Page: ${page}/${Math.ceil(
							queue.songs.length / 10
						)}`,
					});

					int.update({
						embeds: [embed.toJSON()],
					});
					return;
				}

				case "delete": {
					collector.stop();
					return;
				}
			}
		});

		collector.on("end", async () => {
			await msg.delete();
			return;
		});
	}
}
