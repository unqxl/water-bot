import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { LanguageService } from "../../../services/Language";
import { GuildService } from "../../../services/Guild";
import { SubCommand } from "../../../types/Command/SubCommand";
import Bot from "../../../classes/Bot";

export default class UnboostTextCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "setup",
			commandName: "settings",

			name: "unboost",
			description:
				"Configuring Unboost Text (when member stops boosting server).",
			descriptionLocalizations: {
				ru: "Настройка текст удаления буста (когда участник перестаёт бустить сервер).",
			},

			memberPermissions: ["ManageGuild"],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const service = new GuildService(this.client);
		const settings = await service.getSettings(command.guildId).texts;
		const label = await lang.get(
			"SETTINGS_COMMANDS:TEXT_CHANGES:UNBOOST_LABEL"
		);

		const modal = new ModalBuilder();
		modal.setCustomId("unboost_text_handle");

		const component = new TextInputBuilder();
		component.setCustomId("unboost_text_input");
		component.setLabel(label);
		component.setStyle(TextInputStyle.Paragraph);
		component.setRequired(true);
		component.setMinLength(1);
		component.setMaxLength(500);
		component.setPlaceholder(settings.unboost);

		const row = new ActionRowBuilder<TextInputBuilder>();
		row.addComponents(component);
		modal.addComponents(row);

		await command.showModal(modal);
		return command.reply("...");
	}
}
