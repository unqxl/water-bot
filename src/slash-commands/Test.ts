import {
	ApplicationCommandType,
	ActionRow,
	TextInputComponent,
	Modal,
	type ModalActionRowComponent,
	TextInputStyle,
} from "discord.js";
import { CommandInteraction } from "discord.js";
import { SlashCommand } from "../types/Command/SlashCommand";
import { ValidateReturn } from "types/Command/BaseSlashCommand";
import Bot from "../classes/Bot";

export default class TestSlashCommand extends SlashCommand {
	constructor(client: Bot) {
		super(client, {
			name: "test",
			description: "Command for testing some stuff!",
			type: ApplicationCommandType.ChatInput,
		});
	}

	async validate(
		interaction: CommandInteraction,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		if (!this.client.owners.includes(interaction.user.id)) {
			return {
				ok: false,
				error: {
					ephemeral: true,
					embeds: [
						this.client.functions.buildEmbed(
							{
								author: interaction.user,
							},
							"Blurple",
							lang.ERRORS.NO_ACCESS,
							false,
							"❌",
							true
						),
					],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		interaction: CommandInteraction,
		lang: typeof import("@locales/English").default
	) {
		const modal = new Modal()
			.setCustomId("TestModal")
			.setTitle("Test Modal");

		const ApplicationComponent = new TextInputComponent()
			.setCustomId("UserName")
			.setLabel("Enter Your Real Name")
			.setStyle(TextInputStyle.Short);

		const rows = [ApplicationComponent].map((component) =>
			new ActionRow<ModalActionRowComponent>().addComponents(component)
		);

		modal.addComponents(...rows);

		await interaction.showModal(modal);
	}
}
