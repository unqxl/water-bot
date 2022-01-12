import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class MuteRoleCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "muterole",
			aliases: ["mr"],

			description: {
				en: "Shows/Sets/Removes Server's Mute Role!",
				ru: "Показывает/Ставит/Удаляет Мут Роль Сервера!",
			},

			usage: "<prefix>muterole <show|set|reset> [role]",
			category: Categories.SETTINGS,
			memberPermissions: ["ADMINISTRATOR"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		var actions = ["show", "set", "reset"];
		var action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			var role = this.client.database.getSetting(
				message.guild,
				"muteRole"
			);

			if (role === "0") role = lang.GLOBAL.NONE;
			else role = message.guild.roles.cache.get(role).toString();

			const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
			const text = lang.SETTINGS.SHOW(type, role);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				false,
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		} else if (action === "set") {
			const role =
				message.mentions.roles.first() ||
				message.guild.roles.cache.get(args[1]);

			if (!role) {
				const text = lang.ERRORS.ARGS_MISSING.replace(
					"{cmd_name}",
					"muterole"
				);
				const embed = this.client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(text),
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			this.client.database.set(message.guild, "muteRole", role.id);

			const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
			const text = lang.SETTINGS.SETTED(type, role.toString());
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		} else if (action === "reset") {
			this.client.database.set(message.guild, "muteRole", "0");

			const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
			const text = lang.SETTINGS.RESETTED(type);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}
	}
}
