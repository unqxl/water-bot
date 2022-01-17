import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";
import { bold } from "@discordjs/builders";

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
		const {
			LANGUAGE,
			MEMBERS_CHANNEL,
			LOG_CHANNEL,
			TWITCH_CHANNEL,
			AUTO_ROLE,
			MUTE_ROLE,
			PREFIX,
		} = lang.SETTINGS.CONFIG.TYPES;
		const { NONE } = lang.GLOBAL;

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
		text += `› ${bold(MEMBERS_CHANNEL)}: ${bold(membersChannel)}\n`;
		text += `› ${bold(LOG_CHANNEL)}: ${bold(logsChannel)}\n`;
		text += `› ${bold(TWITCH_CHANNEL)}: ${bold(twitchChannel)}\n`;
		text += "\n";
		text += `› ${bold(AUTO_ROLE)}: ${bold(autoRole)}\n`;
		text += `› ${bold(MUTE_ROLE)}: ${bold(muteRole)}`;

		//? Sending Message
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			text,
			false,
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
