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

export default class ByeTextCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "setup",
			commandName: "settings",

			name: "bye",
			description: "Configuring Bye Text (when member leaves server).",
			descriptionLocalizations: {
				ru: "Настройка текст прощания (когда участник покидает сервер).",
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
			"SETTINGS_COMMANDS:TEXT_CHANGES:BYE_LABEL"
		);

		const modal = new ModalBuilder();
		modal.setCustomId("bye_text_handle");

		const component = new TextInputBuilder();
		component.setCustomId("bye_text_input");
		component.setLabel(label);
		component.setStyle(TextInputStyle.Paragraph);
		component.setRequired(true);
		component.setMinLength(1);
		component.setMaxLength(500);
		component.setPlaceholder(settings.bye);

		const row = new ActionRowBuilder<TextInputBuilder>();
		row.addComponents(component);
		modal.addComponents(row);

		await command.showModal(modal);
		return command.reply("...");
	}
}
