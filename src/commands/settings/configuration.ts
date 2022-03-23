import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class ConfigurationCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "configuration",
			aliases: ["config", "cfg", "settings"],

			description: {
				en: "Shows current Guild Settings!",
				ru: "Выводит текущие настройки сервера!",
			},

			category: Categories.SETTINGS,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const settings = await this.client.database.getSettings(
			message.guild.id
		);

		const custom_commands = this.client.custom_commands.get(
			message.guild.id
		);

		const config = this.client.configurations.get(message.guild.id);

		const {
			LANGUAGE,
			CUSTOM_COMMANDS,
			MEMBERS_CHANNEL,
			LOG_CHANNEL,
			TWITCH_CHANNEL,
			AUTO_ROLE,
			MUTE_ROLE,
			PREFIX,
			TWITCH_SYSTEM,
		} = lang.SETTINGS.CONFIG.TYPES;
		const { NONE, ENABLED, DISABLED } = lang.GLOBAL;

		//? Channels
		const membersChannel = settings.members_channel
			? message.guild.channels.cache
					.get(settings.members_channel)
					.toString()
			: NONE;
		const logsChannel = settings.log_channel
			? message.guild.channels.cache.get(settings.log_channel).toString()
			: NONE;
		const twitchChannel = settings.twitch_channel
			? message.guild.channels.cache
					.get(settings.twitch_channel)
					.toString()
			: NONE;

		//? Roles
		const autoRole = settings.auto_role
			? message.guild.roles.cache.get(settings.auto_role).toString()
			: NONE;
		const muteRole = settings.mute_role
			? message.guild.roles.cache.get(settings.mute_role).toString()
			: NONE;

		//? Text
		var text = "";
		text += `› ${bold(PREFIX)}: ${bold(settings.prefix)}\n`;
		text += `› ${bold(LANGUAGE)}: ${bold(settings.locale)}\n`;
		text += "\n";
		text += `› ${bold(TWITCH_SYSTEM)}: ${bold(
			config.twitchSystem === true ? ENABLED : DISABLED
		)}\n`;
		text += "\n";
		text += `› ${bold(MEMBERS_CHANNEL)}: ${bold(membersChannel)}\n`;
		text += `› ${bold(LOG_CHANNEL)}: ${bold(logsChannel)}\n`;
		text += `› ${bold(TWITCH_CHANNEL)}: ${bold(twitchChannel)}\n`;
		text += "\n";
		text += `› ${bold(AUTO_ROLE)}: ${bold(autoRole)}\n`;
		text += `› ${bold(MUTE_ROLE)}: ${bold(muteRole)}\n`;
		text += "\n";
		text += `› ${bold(CUSTOM_COMMANDS)}: ${bold(
			custom_commands.length.toString()
		)} (${bold(`${settings.prefix}custom-commands`)})`;

		//? Sending Message
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			false,
			true
		);

		return message.channel.send({
			embeds: [embed.json],
		});
	}
}
