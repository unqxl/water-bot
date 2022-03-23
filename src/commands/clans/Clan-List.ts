import {
	Message,
	Util,
	ButtonBuilder,
	ActionRowBuilder,
	ComponentType,
} from "discord.js";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { GuildClan } from "../../interfaces/Clans";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class ClanListCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "clan-list",

			description: {
				en: "Shows Guild's Clan List!",
				ru: "Показывает список кланов сервера!",
			},

			category: Categories.CLANS,
			usage: "<prefix>clan-list",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const data = await this.client.clans.list(message.guild.id);
		if ("message" in data) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				data.message,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.json],
				},
			};
		}

		return { ok: true };
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const data = (await this.client.clans.list(
			message.guild.id
		)) as GuildClan[];

		let i0 = 0;
		let i1 = 10;
		let page = 1;

		var description = data
			.sort((a, b) => b.membersCount - a.membersCount)
			.map((v) => v)
			.map((v, i) => {
				const name = Util.escapeMarkdown(v.name);
				const abr = Util.escapeMarkdown(v.abr);
				const memberCount = this.client.functions.sp(v.membersCount);

				return `${bold((i + 1).toString())}: [${bold(abr)}] ${bold(
					name
				)} | ${bold(
					`${memberCount} ${this.client.functions.declOfNum(
						v.membersCount,
						lang.FUNCTIONS.DECL.MEMBERS
					)}`
				)}`;
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

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			previousPage,
			nextPage,
			deletePage
		);

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			description,
			false,
			false,
			true
		);

		embed.embed.setFooter({
			text: `Page: ${page}/${Math.ceil(data.length / 10)}`,
		});

		const msg = await message.channel.send({
			embeds: [embed.json],
			components: [row],
		});

		const collector = await msg.createMessageComponentCollector({
			filter: (btn) => btn.user.id === message.author.id,
			componentType: ComponentType.Button,
			time: 60 * 1000 * 5,
		});

		collector.on("collect", (btn) => {
			switch (btn.customId) {
				case "previous": {
					i0 -= 10;
					i1 -= 10;
					page -= 1;

					if (i0 < 0) {
						collector.stop();

						return btn.update({
							components: [],
						});
					}

					description = data
						.sort((a, b) => b.membersCount - a.membersCount)
						.map((v) => v)
						.map((v, i) => {
							const name = Util.escapeMarkdown(v.name);
							const abr = Util.escapeMarkdown(v.abr);
							const memberCount = this.client.functions.sp(
								v.membersCount
							);

							return `${bold((i + 1).toString())}: [${bold(
								abr
							)}] ${bold(name)} | ${bold(
								`${memberCount} ${this.client.functions.declOfNum(
									v.membersCount,
									lang.FUNCTIONS.DECL.MEMBERS
								)}`
							)}`;
						})
						.slice(i0, i1)
						.join("\n");

					embed.embed.setDescription(description);
					embed.embed.setFooter({
						text: `Page: ${page}/${Math.ceil(data.length / 10)}`,
					});

					return btn.update({
						embeds: [embed.json],
					});
				}

				case "next": {
					i0 += 10;
					i1 += 10;
					page += 1;

					if (i1 > data.length + 10) {
						collector.stop();

						return btn.update({
							components: [],
						});
					}

					if (!i0 || !i1) {
						collector.stop();

						return btn.update({
							components: [],
						});
					}

					description = data
						.sort((a, b) => b.membersCount - a.membersCount)
						.map((v) => v)
						.map((v, i) => {
							const name = Util.escapeMarkdown(v.name);
							const abr = Util.escapeMarkdown(v.abr);
							const memberCount = this.client.functions.sp(
								v.membersCount
							);

							return `${bold((i + 1).toString())}: [${bold(
								abr
							)}] ${bold(name)} | ${bold(
								`${memberCount} ${this.client.functions.declOfNum(
									v.membersCount,
									lang.FUNCTIONS.DECL.MEMBERS
								)}`
							)}`;
						})
						.slice(i0, i1)
						.join("\n");

					embed.embed.setDescription(description);
					embed.embed.setFooter({
						text: `Page: ${page}/${Math.ceil(data.length / 10)}`,
					});

					return btn.update({
						embeds: [embed.json],
					});
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
