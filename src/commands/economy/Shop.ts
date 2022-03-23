import {
	ActionRowBuilder,
	ButtonBuilder,
	ComponentType,
	Message,
	Util,
} from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";
import { EconomyGuildShopItem } from "@badboy-discord/discordjs-economy/src/Constants";

export default class ShopCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "shop",

			description: {
				en: "Allows You to Create/View/Remove/Buy Item(s) from Guild's Shop!",
				ru: "Позволяет вам Создать/Увидеть/Удалить/Купить Предмет(ы) из магазина сервера!",
			},

			category: Categories.ECONOMY,
			usage: "<prefix>shop [all|create|delete|buy] [itemid]",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const prefix = await this.client.database.getSetting(
			message.guild.id,
			"prefix"
		);

		const balance = await this.client.economy.balance.get(
			message.guild.id,
			message.author.id
		);

		var actions = ["all", "create", "delete", "buy"];
		var action = args[0];
		if (!action || !actions.includes(action)) action = "all";

		if (action === "all") {
			const shop_data = await this.client.economy.shop.all(
				message.guild.id
			);

			if (typeof shop_data === "boolean") {
				const text = lang.ECONOMY.SHOP.ALL.EMPTY;
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.embed.toJSON()],
				});
			}

			var res = shop_data
				.map((v) => v)
				.map((v, i) => {
					const name = Util.escapeMarkdown(v.name);
					const format = this.client.functions.declOfNum(
						v.cost,
						lang.FUNCTIONS.DECL.COINS
					);

					return `[${i + 1}] ${name} (${v.cost} ${format})\n${
						v.description
					}\n`;
				})
				.slice(0, 10)
				.join("\n");

			//! Collector

			let i0 = 0;
			let i1 = 10;
			let page = 1;

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
				res,
				false,
				false,
				true
			);

			embed.embed.setFooter({
				text: `Page: ${page}/${Math.ceil(shop_data.length / 10)}`,
			});

			const msg = await message.channel.send({
				embeds: [embed.embed.toJSON()],
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

						res = shop_data
							.map((v) => v)
							.map((v, i) => {
								const name = Util.escapeMarkdown(v.name);
								const format = this.client.functions.declOfNum(
									v.cost,
									lang.FUNCTIONS.DECL.COINS
								);

								return `[${i + 1}] ${name} (${
									v.cost
								} ${format})\n${v.description}\n`;
							})
							.slice(i0, i1)
							.join("\n");

						embed.embed.setDescription(res);
						embed.embed.setFooter({
							text: `Page: ${page}/${Math.ceil(
								shop_data.length / 10
							)}`,
						});

						return btn.update({
							embeds: [embed.embed.toJSON()],
						});
					}

					case "next": {
						i0 += 10;
						i1 += 10;
						page += 1;

						if (i1 > this.client.guilds.cache.size + 10) {
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

						res = shop_data
							.map((v) => v)
							.map((v, i) => {
								const name = Util.escapeMarkdown(v.name);
								const format = this.client.functions.declOfNum(
									v.cost,
									lang.FUNCTIONS.DECL.COINS
								);

								return `[${i + 1}] ${name} (${
									v.cost
								} ${format})\n${v.description}\n`;
							})
							.slice(i0, i1)
							.join("\n");

						embed.embed.setDescription(res);
						embed.embed.setFooter({
							text: `Page: ${page}/${Math.ceil(
								shop_data.length / 10
							)}`,
						});

						return btn.update({
							embeds: [embed.embed.toJSON()],
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
		} else if (action === "create") {
			const item_data: EconomyGuildShopItem = {
				name: null,
				description: null,
				cost: null,
				role: null,
			};

			//! Item Name
			const name_prompt = lang.ECONOMY.SHOP.CREATE.PROMPTS.WRITE_NAME;
			const name_embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				name_prompt,
				false,
				"✉️",
				true
			);

			const name_answer = await this.client.functions.promptMessage(
				message,
				{
					embeds: [name_embed.embed.toJSON()],
				},
				15000
			);
			if (!name_answer) {
				const text = lang.ECONOMY.SHOP.CREATE.PROMPTS_ERRORS.NAME;
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			item_data.name = name_answer.toString();

			//! Item Description
			const description_prompt =
				lang.ECONOMY.SHOP.CREATE.PROMPTS.WRITE_DESCRIPTION;
			const description_embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				description_prompt,
				false,
				"✉️",
				true
			);

			const description_answer =
				await this.client.functions.promptMessage(
					message,
					{
						embeds: [description_embed.embed.toJSON()],
					},
					15000
				);
			if (!description_answer) {
				const text =
					lang.ECONOMY.SHOP.CREATE.PROMPTS_ERRORS.DESCRIPTION;
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			item_data.description = description_answer.toString();

			//! Item Cost
			const cost_prompt = lang.ECONOMY.SHOP.CREATE.PROMPTS.WRITE_COST;
			const cost_embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				cost_prompt,
				false,
				"✉️",
				true
			);

			const cost_answer = await this.client.functions.promptMessage(
				message,
				{
					embeds: [cost_embed.embed.toJSON()],
				},
				15000
			);
			if (!cost_answer) {
				const text = lang.ECONOMY.SHOP.CREATE.PROMPTS_ERRORS.COST;
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			if (!Number(cost_answer)) {
				const text = lang.ERRORS.IS_NAN(cost_answer.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			} else if (cost_answer.toString().includes("-")) {
				const text = lang.ERRORS.NEGATIVE_NUMBER(
					cost_answer.toString()
				);

				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			item_data.cost = Number(cost_answer);

			//! Item Role
			const role_prompt = lang.ECONOMY.SHOP.CREATE.PROMPTS.WRITE_ROLE;
			const role_embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				role_prompt,
				false,
				"✉️",
				true
			);

			const role_answer = await this.client.functions.promptMessage(
				message,
				{
					embeds: [role_embed.embed.toJSON()],
				},
				15000
			);

			if (!role_answer || role_answer === "skip") item_data.role = null;
			else {
				const regex = /<@&[0-9]+>/gm;
				if (!regex.test(role_answer.toString())) {
					const text =
						lang.ECONOMY.SHOP.CREATE.PROMPTS_ERRORS.REGEX_ERROR;
					const embed = this.client.functions.buildEmbed(
						message,
						"Red",
						text,
						false,
						"❌",
						true
					);

					return message.channel.send({
						embeds: [embed.embed.toJSON()],
					});
				}

				item_data.role = role_answer
					.toString()
					.replace("<@&", "")
					.replace(">", "");
			}

			await this.client.economy.shop.create(message.guild.id, item_data);

			const text = lang.ECONOMY.SHOP.CREATE.CREATED(
				item_data.name,
				item_data.cost
			);

			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed.embed.toJSON()],
			});
		} else if (action === "delete") {
			const id_prompt = lang.ECONOMY.SHOP.BUY.PROMPTS.WRITE_ID(prefix);
			const id_embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				id_prompt,
				false,
				"✉️",
				true
			);

			const id_answer = await this.client.functions.promptMessage(
				message,
				{
					embeds: [id_embed.embed.toJSON()],
				},
				15000
			);
			if (!id_answer) {
				const text = lang.ECONOMY.SHOP.BUY.PROMPTS_ERRORS.ID;
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			if (!Number(id_answer)) {
				const text = lang.ERRORS.IS_NAN(id_answer.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			} else if (id_answer.toString().includes("-")) {
				const text = lang.ERRORS.NEGATIVE_NUMBER(id_answer.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			const items = (await this.client.economy.shop.all(
				message.guild.id
			)) as EconomyGuildShopItem[];

			const item = items.find((x) => x.id === Number(id_answer));
			if (!item) {
				const text =
					lang.ECONOMY.SHOP.BUY.PROMPTS_ERRORS.ITEM_NOT_FOUND(
						id_answer.toString()
					);

				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			await this.client.economy.shop.delete(message.guild.id, item.id);

			const text = lang.ECONOMY.SHOP.BUY.PURCHASED(item.name);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({ embeds: [embed.embed.toJSON()] });
		} else if (action === "buy") {
			const id_prompt = lang.ECONOMY.SHOP.DELETE.PROMPTS.WRITE_ID(prefix);
			const id_embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				id_prompt,
				false,
				"✉️",
				true
			);

			const id_answer = await this.client.functions.promptMessage(
				message,
				{
					embeds: [id_embed.embed.toJSON()],
				},
				15000
			);
			if (!id_answer) {
				const text = lang.ECONOMY.SHOP.DELETE.PROMPTS_ERRORS.ID;
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			if (!Number(id_answer)) {
				const text = lang.ERRORS.IS_NAN(id_answer.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			} else if (id_answer.toString().includes("-")) {
				const text = lang.ERRORS.NEGATIVE_NUMBER(id_answer.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			const items = (await this.client.economy.shop.all(
				message.guild.id
			)) as EconomyGuildShopItem[];

			const item = items.find((x) => x.id === Number(id_answer));
			if (!item) {
				const text =
					lang.ECONOMY.SHOP.DELETE.PROMPTS_ERRORS.ITEM_NOT_FOUND(
						id_answer.toString()
					);

				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			if (item.cost > balance) {
				const action = lang.ECONOMY_ACTIONS.BUY_ITEM;
				const text = lang.ERRORS.NOT_ENOUGH_MONEY(action);
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({ embeds: [embed.embed.toJSON()] });
			}

			await this.client.economy.items.buy(
				message.guild.id,
				message.author.id,
				item.id
			);

			const text = lang.ECONOMY.SHOP.BUY.PURCHASED(item.name);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({ embeds: [embed.embed.toJSON()] });
		}
	}
}
