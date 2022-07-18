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

export default class BoostTextCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			groupName: "setup",
			commandName: "settings",

			name: "boost",
			description: "Configuring Boost Text (when member boosts server).",
			descriptionLocalizations: {
				ru: "Настройка текст буста (когда участник бустит сервер).",
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
		const label = await lang.get("SETTINGS_COMMANDS:TEXT_CHANGES:BOOST_LABEL");

		const modal = new ModalBuilder();
		modal.setCustomId("boost_text_handle");

		const component = new TextInputBuilder();
		component.setCustomId("boost_text_input");
		component.setLabel(label);
		component.setStyle(TextInputStyle.Paragraph);
		component.setRequired(true);
		component.setMinLength(1);
		component.setMaxLength(500);
		component.setPlaceholder(settings.boost);

		const row = new ActionRowBuilder<TextInputBuilder>();
		row.addComponents(component);
		modal.addComponents(row);

		await command.showModal(modal);
		return command.reply("...");
	}
}
