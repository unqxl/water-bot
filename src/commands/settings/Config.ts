import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold, inlineCode } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class ConfigCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "config",

			description: {
				en: "Displays Server Configuration!",
				ru: "Выводит Конфигурацию Сервера!",
			},

			category: Categories.SETTINGS,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const config = this.client.database.getSettings(message.guild);

		const [
			language,
			memberschannel,
			logchannel,
			levelschannel,
			autorole,
			muterole,
			antilink,
			antispam,
			antiinvite,
			twitchenabled,
			twitchchannel,
			twitchstreamers,
			djroles,
			wiki,
		] = [
			lang.SETTINGS.CONFIG.TYPES.LANGUAGE,
			lang.SETTINGS.CONFIG.TYPES.MEMBERS_CHANNEL,
			lang.SETTINGS.CONFIG.TYPES.LOG_CHANNEL,
			lang.SETTINGS.CONFIG.TYPES.LEVELS_CHANNEL,
			lang.SETTINGS.CONFIG.TYPES.AUTO_ROLE,
			lang.SETTINGS.CONFIG.TYPES.MUTE_ROLE,
			lang.SETTINGS.CONFIG.TYPES.ANTILINK,
			lang.SETTINGS.CONFIG.TYPES.ANTISPAM,
			lang.SETTINGS.CONFIG.TYPES.ANTIINVITE,
			lang.SETTINGS.CONFIG.TYPES.TWITCH_ENABLED,
			lang.SETTINGS.CONFIG.TYPES.TWITCH_CHANNEL,
			lang.SETTINGS.CONFIG.TYPES.TWITCH_STREAMERS,
			lang.SETTINGS.CONFIG.TYPES.DJ_ROLES,
			lang.SETTINGS.CONFIG.WIKI,
		];

		// Enabled or Disabled
		const [enabled, disabled] = [lang.GLOBAL.ENABLED, lang.GLOBAL.DISABLED];

		// Channels
		const membersChannel =
			message.guild.channels.cache.get(config.membersChannel) || "-";
		const logChannel =
			message.guild.channels.cache.get(config.logChannel) || "-";
		const levelsChannel =
			message.guild.channels.cache.get(config.levelsChannel) || "-";
		const twitchChannel =
			message.guild.channels.cache.get(config.twitchChannelID) || "-";

		// Roles
		const roles = [];
		const DJRoles = this.client.database.getSetting(message.guild, 'djRoles');
		
		if(DJRoles.length) {
			for(const { roleID } of DJRoles) {
				const role = message.guild.roles.cache.get(roleID);
				if(!role) continue;

				roles.push(role.toString());
			}
		};

		const autoRole = message.guild.roles.cache.get(config.autoRole) || "-";
		const muteRole = message.guild.roles.cache.get(config.muteRole) || "-";

		// Toggles
		const antiLink = config.antilink !== "0" ? enabled : disabled;
		const antiSpam = config.antispam !== "0" ? enabled : disabled;
		const antiInvite = config.antiinvite !== "0" ? enabled : disabled;
		const twitchEnabled = config.twitchEnabled !== "0" ? enabled : disabled;

		// Twitch Streamers
		const streamers =
			config.twitchStreamers.length !== 0
				? config.twitchStreamers
						.map((streamer) => streamer.name)
						.join(", ")
				: "-";

		var text = "";
		text += `› ${bold(language)}: ${bold(config.language)}\n\n`;
		text += `› ${bold(memberschannel)}: ${bold(
			membersChannel.toString()
		)}\n`;
		text += `› ${bold(logchannel)}: ${bold(logChannel.toString())}\n`;
		text += `› ${bold(levelschannel)}: ${bold(levelsChannel.toString())}\n`;
		text += `› ${bold(twitchchannel)}: ${bold(
			twitchChannel.toString()
		)}\n\n`;
		text += `› ${bold(autorole)}: ${bold(autoRole.toString())}\n`;
		text += `› ${bold(muterole)}: ${bold(muteRole.toString())}\n`;
		text += `› ${bold(djroles)}: ${bold(roles.join(', '))}\n\n`;
		text += `› ${bold(antilink)}: ${bold(antiLink)}\n`;
		text += `› ${bold(antispam)}: ${bold(antiSpam)}\n`;
		text += `› ${bold(antiinvite)}: ${bold(antiInvite)}\n`;
		text += `› ${bold(twitchenabled)}: ${bold(twitchEnabled)}\n\n`;
		text += `› ${bold(twitchstreamers)}: ${bold(streamers)}\n\n`;
		text += `${inlineCode(wiki)}`;

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
