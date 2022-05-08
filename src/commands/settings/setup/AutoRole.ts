import {
	ChatInputCommandInteraction,
	SelectMenuBuilder,
	SelectMenuComponentOptionData,
	ActionRowBuilder,
	ComponentType,
	roleMention,
	EmbedBuilder,
	bold,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

export default class AutoRoleCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "setup",
			commandName: "settings",
			name: "autorole",
			description: "Configuring Auto Role System!",
			memberPermissions: ["ManageGuild"],
			options: [],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const service = new GuildService(this.client);
		const {
			SETTINGS_COMMANDS: { CONFIG },
			OTHER,
		} = await lang.all();

		if (service.getSetting(command.guildId, "auto_role")) {
			const text = await lang.get(
				"SETTINGS_COMMANDS:RESET_PROMPT",
				CONFIG.AUTO_ROLE
			);

			const color = this.client.functions.color("Blurple");
			const author = this.client.functions.author(command.member);
			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`⚠ | ${bold(text)}`);
			embed.setTimestamp();

			const confirm = new ButtonBuilder();
			confirm.setCustomId("confirm");
			confirm.setStyle(ButtonStyle.Success);
			confirm.setLabel(OTHER.YES);
			confirm.setEmoji("✅");

			const cancel = new ButtonBuilder();
			cancel.setCustomId("cancel");
			cancel.setStyle(ButtonStyle.Danger);
			cancel.setLabel(OTHER.NO);
			cancel.setEmoji("❌");

			const row = new ActionRowBuilder<ButtonBuilder>();
			row.addComponents([confirm, cancel]);

			command.reply({
				embeds: [embed],
				components: [row],
			});

			const message = await command.fetchReply();
			const collector = message.createMessageComponentCollector({
				filter: (msg) => msg.user.id === command.user.id,
				componentType: ComponentType.Button,
				time: 60000,
				max: 1,
			});

			collector.on("collect", async (interaction) => {
				if (!interaction.isButton()) return;

				if (interaction.customId === "confirm") {
					service.set(command.guildId, "auto_role", null);

					const text = await lang.get(
						"SETTINGS_COMMANDS:RESET_TEXT",
						CONFIG.AUTO_ROLE
					);

					const embed = new EmbedBuilder();
					embed.setColor(color);
					embed.setAuthor(author);
					embed.setDescription(`✅ | ${bold(text)}`);
					embed.setTimestamp();

					command.editReply({
						embeds: [embed],
						components: [],
					});
				} else if (interaction.customId === "cancel") {
					message.delete();
				}
			});
		}

		const options: SelectMenuComponentOptionData[] = [];
		for (const role of command.guild.roles.cache.values()) {
			if (role.id === command.guild.roles.everyone.id) continue;
			if (role.tags.botId) continue;

			options.push({
				label: role.name,
				value: role.id,
			});
		}

		const menu = new SelectMenuBuilder();
		menu.setCustomId("autorole_menu");
		menu.setMinValues(1);
		menu.setMaxValues(5);
		menu.setOptions(options);

		const row = new ActionRowBuilder<SelectMenuBuilder>();
		row.addComponents([menu]);

		command.reply({
			components: [row],
		});

		const message = await command.fetchReply();
		const collector = message.createMessageComponentCollector({
			filter: (msg) => msg.user.id === command.user.id,
			componentType: ComponentType.SelectMenu,
			time: 60000,
			max: 1,
		});

		collector.on("collect", async (interaction) => {
			const color = this.client.functions.color("Blurple");
			const author = this.client.functions.author(command.member);

			if (!interaction.isSelectMenu()) return;
			if (interaction.values.length === 1) {
				const id = interaction.values[0];
				const mention = roleMention(id);
				service.set(command.guildId, "auto_role", id);

				const text = await lang.get(
					"SETTINGS_COMMANDS:EDIT_TEXT",
					CONFIG.AUTO_ROLE,
					mention
				);

				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`✅ | ${bold(text)}`);
				embed.setTimestamp();

				command.editReply({
					embeds: [embed],
					components: [],
				});
				return;
			}

			service.set(command.guildId, "auto_role", interaction.values);

			const mentions = [];
			for (const id of interaction.values) {
				mentions.push(roleMention(id));
			}

			const text = await lang.get(
				"SETTINGS_COMMANDS:EDIT_TEXT",
				CONFIG.AUTO_ROLE,
				mentions.join(", ")
			);

			const embed = new EmbedBuilder();
			embed.setColor(color);
			embed.setAuthor(author);
			embed.setDescription(`✅ | ${bold(text)}`);
			embed.setTimestamp();

			command.editReply({
				embeds: [embed],
				components: [],
			});
			return;
		});
	}
}
