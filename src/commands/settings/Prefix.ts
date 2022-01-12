import { Message, Util } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import { getRepository } from "typeorm";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import Bot from "../../classes/Bot";

export default class PrefixCommand extends Command {
	constructor(
		client: Bot,
		private readonly guildConfigRepository = getRepository(
			GuildConfiguration
		)
	) {
		super(client, {
			name: "prefix",

			description: {
				en: "Changes Server Prefix!",
				ru: "Меняет Префикс Сервера!",
			},

			category: Categories.SETTINGS,
			usage: "<prefix>prefix [-|reset|prefix]",
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

		const prefix = args[0];
		if (!prefix) {
			const currentText = lang.EVENTS.GUILD_PREFIX.replace(
				"{guild}",
				message.guild.name
			).replace("{prefix}", Util.escapeMarkdown(config.prefix));

			const currentEmbed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(currentText),
				"💬",
				true
			);

			return message.channel.send({
				embeds: [currentEmbed],
			});
		} else if (prefix === "reset") {
			const type = lang.SETTINGS.CONFIG.TYPES.PREFIX;
			const resetText = lang.SETTINGS.RESETTED(type, "-");
			const resetEmbed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(resetText),
				"✅",
				true
			);

			const updatedConfig = await this.guildConfigRepository.save({
				...config,
				prefix: "-",
			});

			this.client.configs.set(message.guild.id, updatedConfig);

			return message.channel.send({
				embeds: [resetEmbed],
			});
		} else {
			const type = lang.SETTINGS.CONFIG.TYPES.PREFIX;
			const changedText = lang.SETTINGS.SETTED(type, prefix);
			const changedEmbed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(changedText),
				"✅",
				true
			);

			const updatedConfig = await this.guildConfigRepository.save({
				...config,
				prefix: prefix,
			});

			this.client.configs.set(message.guild.id, updatedConfig);

			return message.channel.send({
				embeds: [changedEmbed],
			});
		}
	}
}
