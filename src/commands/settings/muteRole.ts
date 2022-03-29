import { Categories } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class MuteRoleCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "muterole",
			aliases: ["mr", "m-role"],

			description: {
				en: "Shows/Sets/Removes Server's Mute Role!",
				ru: "Показывает/Ставит/Удаляет Мут Роль Сервера!",
			},

			usage: "<prefix>muterole <show|set|reset> [role]",
			category: Categories.SETTINGS,
			memberPermissions: ["Administrator"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const config = await this.client.database.getGuild(message.guild.id);

		const actions = ["show", "set", "reset"];
		let action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			let role = config.mute_role;

			if (!role) role = lang.GLOBAL.NONE;
			else role = message.guild.roles.cache.get(role).toString();

			const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
			const text = lang.SETTINGS.SHOW(type, role);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✉️",
				true
			);

			return message.channel.send({
				embeds: [embed.data.toJSON()],
			});
		} else if (action === "set") {
			const role =
				message.mentions.roles.first() ||
				message.guild.roles.cache.get(args[1]);

			if (!role) {
				const text = lang.ERRORS.ARGS_MISSING("muterole");
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed.data.toJSON()],
				});
			}

			await this.client.database.set(
				message.guild.id,
				"mute_role",
				role.id
			);

			const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
			const text = lang.SETTINGS.SETTED(type, role.toString());
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed.data.toJSON()],
			});
		} else if (action === "reset") {
			await this.client.database.set(message.guild.id, "mute_role", null);

			const type = lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE;
			const text = lang.SETTINGS.RESETTED(type);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed.data.toJSON()],
			});
		}
	}
}
