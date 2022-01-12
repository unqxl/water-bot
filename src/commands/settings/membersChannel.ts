import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import { getRepository } from "typeorm";
import Bot from "../../classes/Bot";

export default class MembersChannelCommand extends Command {
	constructor(
		client: Bot,
		private readonly guildConfigRepository = getRepository(
			GuildConfiguration
		)
	) {
		super(client, {
			name: "memberschannel",
			aliases: ["mc"],

			description: {
				en: "Shows/Sets/Removes Server's Members Channel!",
				ru: "Показывает/Ставит/Удаляет Канал для Участников Сервера!",
			},

			usage: "<prefix>memberschannel <show|set|reset> [role]",
			category: Categories.SETTINGS,
			memberPermissions: ["ADMINISTRATOR"],
		});
	}
	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const config = await this.guildConfigRepository.findOne({
			guild_id: message.guild.id,
		});

		var actions = ["show", "set", "reset"];
		var action = args[0];

		if (!action) action = "show";
		if (!actions.includes(action)) action = "show";

		if (action === "show") {
			var channel = config.members_channel;

			if (!channel) channel = lang.GLOBAL.NONE;
			else channel = message.guild.channels.cache.get(channel).toString();

			const type = lang.SETTINGS.CONFIG.TYPES.MEMBERS_CHANNEL;
			const text = lang.SETTINGS.SHOW(type, channel);
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
			const channel =
				message.mentions.channels.first() ||
				message.guild.channels.cache.get(args[1]);

			if (!channel) {
				const text = lang.ERRORS.ARGS_MISSING.replace(
					"{cmd_name}",
					"memberschannel"
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

			const updatedConfig = await this.guildConfigRepository.save({
				...config,
				members_channel: channel.id,
			});

			this.client.configs.set(message.guild.id, updatedConfig);

			const type = lang.SETTINGS.CONFIG.TYPES.MEMBERS_CHANNEL;
			const text = lang.SETTINGS.SETTED(type, channel.toString());
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
			const updatedConfig = await this.guildConfigRepository.save({
				...config,
				members_channel: null,
			});

			this.client.configs.set(message.guild.id, updatedConfig);

			const type = lang.SETTINGS.CONFIG.TYPES.MEMBERS_CHANNEL;
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
