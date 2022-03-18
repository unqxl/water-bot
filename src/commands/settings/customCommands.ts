import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class CustomCommandsCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "custom-commands",
			aliases: ["cc"],

			description: {
				en: "Shows/Creates/Removes Server's Custom Commands!",
				ru: "Показывает/Создаёт/Удаляет Кастом Команды Сервера!",
			},

			usage: "<prefix>custom-commands <show|add|delete> [name]",
			category: Categories.SETTINGS,
			memberPermissions: ["Administrator"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const custom_commands = this.client.custom_commands.get(
			message.guild.id
		);

		var actions = ["show", "create", "delete"];
		var action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			const text = custom_commands.length
				? custom_commands
						.map(
							(cmd, i) =>
								`[${bold(String(i + 1))}] ${bold(cmd.name)}\n${
									cmd.response
								}\n`
						)
						.join("\n")
				: bold(lang.GLOBAL.NONE);

			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				false,
				true
			);

			return message.channel.send({
				embeds: [embed.toJSON()],
			});
		} else if (action === "create") {
			const name = args[1];
			const response = args.slice(2).join(" ");

			if (!name) {
				const text = lang.ERRORS.ARGS_MISSING("custom-commands");
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.toJSON()],
				});
			}

			if (!response) {
				const text = lang.ERRORS.ARGS_MISSING("custom-commands");
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.toJSON()],
				});
			}

			if (custom_commands.find((x) => x.name === name)) {
				const type = lang.SETTINGS.CONFIG.TYPES.CUSTOM_COMMANDS;
				const text = lang.ERRORS.ALREADY_IN_DB(type, name);
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.toJSON()],
				});
			}

			custom_commands.push({
				name: name,
				response: response,
			});

			await this.client.custom_commands.set(
				message.guild.id,
				custom_commands
			);

			const type = lang.SETTINGS.CONFIG.TYPES.CUSTOM_COMMANDS;
			const text = lang.SETTINGS.ADDED(type, name);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed.toJSON()],
			});
		} else if (action === "delete") {
			const name = args[1];

			if (!name) {
				const text = lang.ERRORS.ARGS_MISSING("custom-commands");
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.toJSON()],
				});
			}

			if (!custom_commands.find((x) => x.name === name)) {
				const type = lang.SETTINGS.CONFIG.TYPES.CUSTOM_COMMANDS;
				const text = lang.ERRORS.NOT_FOUND_IN_DB(type, name);
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.toJSON()],
				});
			}

			await this.client.custom_commands.set(
				message.guild.id,
				custom_commands.filter((x) => x.name !== name)
			);

			const type = lang.SETTINGS.CONFIG.TYPES.CUSTOM_COMMANDS;
			const text = lang.SETTINGS.DELETED(type, name);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed.toJSON()],
			});
		}
	}
}
