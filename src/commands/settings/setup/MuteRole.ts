import {
	ChatInputCommandInteraction,
	SelectMenuBuilder,
	SelectMenuComponentOptionData,
	ActionRowBuilder,
	ComponentType,
	roleMention,
	EmbedBuilder,
	bold,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

export default class MuteRoleCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "setup",
			commandName: "settings",
			name: "muterole",
			description: "Configuring Mute Role!",
			memberPermissions: ["ManageGuild"],
			options: [],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const { CONFIG } = await (await lang.all()).SETTINGS_COMMANDS;

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
		menu.setCustomId("muterole_menu");
		menu.setMinValues(1);
		menu.setMaxValues(1);
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
			const service = new GuildService(this.client);
			const color = this.client.functions.color("Blurple");
			const author = this.client.functions.author(command.member);

			if (!interaction.isSelectMenu()) return;

			service.set(command.guildId, "mute_role", interaction.values[0]);

			const mention = roleMention(interaction.values[0]);
			const text = await lang.get(
				"SETTINGS_COMMANDS:EDIT_TEXT",
				CONFIG.MUTE_ROLE,
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
		});
	}
}
