import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { SubCommand } from "../../types/Command/SubCommand";
import { time } from "@discordjs/builders";
import Bot from "../../classes/Bot";

// DayJS
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
import("dayjs/locale/en");
import("dayjs/locale/ru");

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
		lang: typeof import("@locales/English").default
	) {
		const { locale } = await this.client.database.getSettings(
			command.guildId
		);
		locale === "en-US" ? dayjs.locale("en") : dayjs.locale("ru");

		const [
			dayjs_format,
			[
				guilds,
				users,
				emojis,
				channels,
				commands,
				events,
				botUptime,
				apiPing,
				botVersion,
				fieldName,
			],
		] = [
			lang.GLOBAL.DAYJS_FORMAT,
			[
				lang.OTHER.BOTINFO.GUILDS,
				lang.OTHER.BOTINFO.USERS,
				lang.OTHER.BOTINFO.EMOJIS,
				lang.OTHER.BOTINFO.CHANNELS,
				lang.OTHER.BOTINFO.COMMANDS,
				lang.OTHER.BOTINFO.EVENTS,
				lang.OTHER.BOTINFO.UPTIME,
				lang.OTHER.BOTINFO.API_PING,
				lang.OTHER.BOTINFO.BOT_VERSION,
				lang.OTHER.BOTINFO.FIELD_NAME,
			],
		];

		const readyTimestamp = new Date(this.client.readyTimestamp);
		const botInfo = {
			guilds: sp(this.client.guilds.cache.size),
			users: sp(this.client.users.cache.size),
			emojis: sp(this.client.emojis.cache.size),
			channels: sp(this.client.channels.cache.size),
			commands: sp(this.client.commands.size),
			events: sp(this.client.events.size),
			uptime: uptime(this.client.uptime, dayjs_format),
			runTime: time(readyTimestamp, "R"),
			apiPing: `${this.client.ws.ping}ms`,
		};

		const embed = new EmbedBuilder();
		embed.setColor(this.client.functions.color("Blurple"));
		embed.setAuthor(this.client.functions.author(command.member));
		embed.addFields({
			name: `${fieldName}:`,
			value: [
				`› **${guilds}**: **${botInfo.guilds}**`,
				`› **${users}**: **${botInfo.users}**`,
				`› **${emojis}**: **${botInfo.emojis}**`,
				`› **${channels}**: **${botInfo.channels}**`,
				"",
				`› **${commands}**: **${botInfo.commands}**`,
				`› **${events}**: **${botInfo.events}**`,
				`› **${apiPing}**: **${botInfo.apiPing}**`,
				"",
				`› **${botUptime}**: **${botInfo.uptime} (${botInfo.runTime})**`,
				`› **${botVersion}**: **${this.client.version}**`,
			].join("\n"),
		});
		embed.setThumbnail(this.client.user.displayAvatarURL());

		await command.reply({
			embeds: [embed],
		});
	}
}

function uptime(ms: number, format: string) {
	return dayjs.duration(ms).format(format);
}

function sp(num: string | number) {
	return Number(num).toLocaleString("be");
}
