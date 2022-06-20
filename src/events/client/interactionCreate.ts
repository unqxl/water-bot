import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	Interaction,
	InteractionType,
	ModalSubmitInteraction,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import { bold, codeBlock } from "@discordjs/builders";
import Event from "../../types/Event";
import Bot from "../../classes/Bot";

export default class InteractionCreateEvent extends Event {
	constructor() {
		super("interactionCreate");
	}

	async run(client: Bot, interaction: Interaction) {
		if (interaction.type === InteractionType.ModalSubmit) {
			return await this.handleModalSubmit(
				interaction as ModalSubmitInteraction
			);
		}

		if (!interaction.inGuild()) return;
		if (!interaction.isChatInputCommand()) return;

		const lang = new LanguageService(client, interaction.guildId);
		const { PERMISSIONS } = await lang.all();

		await client.application?.commands
			.fetch(interaction.commandId)
			.catch(() => null);

		const command = client.commands.get(this.getCommandName(interaction));
		if (!command) return;

		const botPerms = command.options.botPermissions ?? [];
		const userPerms = command.options.memberPermissions ?? [];

		if (botPerms.length) {
			const missing =
				interaction.guild.members.me.permissions.missing(botPerms);
			if (missing.length) {
				const perms = missing
					.map((perm) => PERMISSIONS[perm])
					.join("\n");

				const color = this.client.functions.color("Red");
				const author = this.client.functions.author(
					interaction.guild.members.me
				);

				const text = await lang.get(
					"ERRORS:BOT_MISSING_PERMISSIONS",
					perms
				);

				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(text)}`);
				embed.setTimestamp();

				return interaction.reply({
					ephemeral: true,
					embeds: [embed],
				});
			}
		}

		if (userPerms.length) {
			const missing = (
				interaction.member as GuildMember
			).permissions.missing(userPerms);
			if (missing.length) {
				const perms = missing
					.map((perm) => PERMISSIONS[perm])
					.join(", ");

				const color = this.client.functions.color("Red");
				const author = this.client.functions.author(
					interaction.member as GuildMember
				);

				const text = await lang.get(
					"ERRORS:USER_MISSING_PERMISSIONS",
					perms
				);

				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(`❌ | ${bold(text)}`);
				embed.setTimestamp();

				return interaction.reply({
					ephemeral: true,
					embeds: [embed],
				});
			}
		}

		if (command.validate) {
			const { ok, error } = await command.validate(interaction, lang);
			if (!ok) return interaction.reply(error);
		}

		return await command.run(interaction, lang);
	}

	getCommandName(interaction: ChatInputCommandInteraction) {
		let command: string;

		const commandName = interaction.commandName;
		const group = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) {
			if (group) {
				command = `${commandName}-${group}-${subCommand}`;
			} else {
				command = `${commandName}-${subCommand}`;
			}
		} else {
			command = commandName;
		}

		return command;
	}

	async handleModalSubmit(interaction: ModalSubmitInteraction) {
		switch (interaction.customId) {
			case "eval_code_submission": {
				const code = interaction.fields.getTextInputValue("code");

				let evaluated;
				try {
					evaluated = await eval(code);
				} catch (error) {
					evaluated = error.message;
				}

				if (typeof evaluated !== "string") {
					evaluated = JSON.stringify(evaluated);
				} else {
					evaluated = evaluated.replace(/\n/g, "\n\t");
					evaluated = evaluated.replace(this.client.toJSON, "❌");
				}

				const color = this.client.functions.color("Blurple");
				const author = this.client.functions.author(
					interaction.member as GuildMember
				);

				const embed = new EmbedBuilder();
				embed.setColor(color);
				embed.setAuthor(author);
				embed.setDescription(codeBlock("js", evaluated));
				embed.setTimestamp();

				interaction.reply({
					content: undefined,
					embeds: [embed],
				});

				return;
			}
		}
	}
}
