import { bold, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

export default class ConfigCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "settings",
			name: "config",
			description: "Displays Current Guild Settings",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const service = new GuildService(this.client);
		const guild = await service.getSettings(command.guild.id);

		const { CONFIG } = await (await lang.all()).SETTINGS_COMMANDS;
		const { NONE } = await (await lang.all()).OTHER;

		const roles = [
			guild.auto_role
				? command.guild.roles.cache.get(guild.auto_role).toString()
				: NONE,
			guild.mute_role
				? command.guild.roles.cache.get(guild.mute_role).toString()
				: NONE,
		];

		const channels = [
			guild.members_channel
				? command.guild.roles.cache
						.get(guild.members_channel)
						.toString()
				: NONE,
			guild.twitch_channel
				? command.guild.roles.cache.get(guild.twitch_channel).toString()
				: NONE,
			guild.log_channel
				? command.guild.roles.cache.get(guild.log_channel).toString()
				: NONE,
		];

		const res = [
			`› ${bold(CONFIG.AUTO_ROLE)}: ${bold(roles[0])}`,
			`› ${bold(CONFIG.MUTE_ROLE)}: ${bold(roles[1])}`,
			"",
			`› ${bold(CONFIG.MEMBERS_CHANNEL)}: ${bold(channels[0])}`,
			`› ${bold(CONFIG.TWITCH_CHANNEL)}: ${bold(channels[1])}`,
			`› ${bold(CONFIG.LOG_CHANNEL)}: ${bold(channels[2])}`,
		].join("\n");

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(command.member);
		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(res);
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
