import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import { time } from "@discordjs/builders";
import Bot from "../../classes/Bot";

// DayJS
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { GuildService } from "../../services/Guild";

dayjs.extend(duration);
import("dayjs/locale/en");
import("dayjs/locale/ru");
import("dayjs/locale/uk");

export default class BotInfoCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "botinfo",
			description: "Displays Current Bot Statistics",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const service = new GuildService();
		const locale = await service.getSetting(command.guildId, "locale");

		locale === "en-US"
			? dayjs.locale("en")
			: locale === "ru-RU"
			? dayjs.locale("ru")
			: dayjs.locale("uk");

		const { BOTINFO } = await (await lang.all()).OTHER_COMMANDS;
		const createdTimestamp = new Date(this.client.user.createdTimestamp);
		const readyTimestamp = new Date(this.client.readyTimestamp);

		const INFO = {
			GUILDS: sp(this.client.guilds.cache.size),
			USERS: sp(this.client.users.cache.size),
			CHANNELS: sp(this.client.channels.cache.size),
			PING: `${this.client.ws.ping}ms`,
			COMMANDS: sp(this.client.slashCommands.size),
			VERSION: this.client.version,
			CREATED: time(createdTimestamp, "R"),
			STARTED: time(readyTimestamp, "R"),
		};

		const embed = new EmbedBuilder();
		embed.setColor(this.client.functions.color("Blurple"));
		embed.setAuthor(this.client.functions.author(command.member));
		embed.setThumbnail(this.client.user.displayAvatarURL());
		embed.setDescription(
			[
				`**${BOTINFO.BOT_GUILDS}**: **${INFO.GUILDS}**`,
				`**${BOTINFO.BOT_USERS}**: **${INFO.USERS}**`,
				`**${BOTINFO.BOT_CHANNELS}**: **${INFO.CHANNELS}**`,
				`**${BOTINFO.BOT_COMMANDS}**: **${INFO.COMMANDS}**`,
				"",
				`**${BOTINFO.BOT_VERSION}**: **${INFO.VERSION}**`,
				`**${BOTINFO.BOT_PING}**: **${INFO.PING}**`,
				`**${BOTINFO.BOT_CREATED}**: **${INFO.CREATED}**`,
				`**${BOTINFO.BOT_STARTED}**: **${INFO.STARTED}**`,
			].join("\n")
		);

		await command.reply({
			embeds: [embed],
		});
	}
}

function sp(num: string | number) {
	return Number(num).toLocaleString("be");
}
