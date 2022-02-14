import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class DJRolesCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "djroles",
			aliases: ["djr", "dj"],

			description: {
				en: "Shows/Creates/Removes Server's DJ Roles!",
				ru: "Показывает/Создаёт/Удаляет DJ Роли Сервера!",
			},

			usage: "<prefix>djroles <show|add|delete> [role]",
			category: Categories.SETTINGS,
			memberPermissions: ["Administrator"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const config = this.client.configurations.get(message.guild.id);

		var actions = ["show", "add", "delete"];
		var action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			const text = config.djRoles.length
				? config.djRoles
						.map((role_id) =>
							message.guild.roles.cache.get(role_id)
								? message.guild.roles.cache
										.get(role_id)
										.toString()
								: "Deleted Role"
						)
						.join(", ")
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
				embeds: [embed],
			});
		} else if (action === "add") {
			const role =
				message.mentions.roles.first() ||
				message.guild.roles.cache.get(args[1]);

			if (!role) {
				const text = lang.ERRORS.ARGS_MISSING("djroles");
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			if (role.id === message.guild.roles.everyone.id) {
				const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
				const text = lang.ERRORS.CANNOT_BE_EVERYONE(type);
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			if (config.djRoles.find((x) => x === role.id)) {
				const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
				const text = lang.ERRORS.ALREADY_IN_DB(type, role.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			config.djRoles.push(role.id);
			await this.client.configurations.set(message.guild.id, config);

			const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
			const text = lang.SETTINGS.ADDED(type, role.toString());
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		} else if (action === "delete") {
			const role =
				message.mentions.roles.first() ||
				message.guild.roles.cache.get(args[1]);

			if (!role) {
				const text = lang.ERRORS.ARGS_MISSING("djroles");
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			if (role.id === message.guild.roles.everyone.id) {
				const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
				const text = lang.ERRORS.CANNOT_BE_EVERYONE(type);
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			if (!config.djRoles.find((x) => x === role.id)) {
				const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
				const text = lang.ERRORS.NOT_FOUND_IN_DB(type, role.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			await this.client.configurations.set(message.guild.id, {
				djRoles: config.djRoles.filter((x) => x !== role.id),
				twitchSystem: config.twitchSystem,
				twitchStreamers: config.twitchStreamers,
			});

			const type = lang.SETTINGS.CONFIG.TYPES.DJ_ROLES;
			const text = lang.SETTINGS.DELETED(type, role.toString());
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}
	}
}
