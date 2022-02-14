import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

// DayJS
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
import("dayjs/locale/en");
import("dayjs/locale/ru");

export default class BotinfoCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "botinfo",
			aliases: ["bi"],

			description: {
				en: "Displays Current Bot Statistics!",
				ru: "Выводит Текующую Статистику Бота!",
			},

			category: Categories.OTHER,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const guildLocale = await this.client.database.getSetting(
			message.guild.id,
			"locale"
		);

		if (guildLocale === "en-US") dayjs.locale("en");
		else if (guildLocale === "ru-RU") dayjs.locale("ru");

		const format = lang.GLOBAL.DAYJS_FORMAT;
		const title = lang.OTHER.BOTINFO.TITLE;

		// Bot Information
		const [
			guilds,
			users,
			emojis,
			channels,
			commands,
			events,
			botUptime,
			runnedAt,
			apiPing,
			botVersion,
			fieldName,
		] = [
			lang.OTHER.BOTINFO.GUILDS,
			lang.OTHER.BOTINFO.USERS,
			lang.OTHER.BOTINFO.EMOJIS,
			lang.OTHER.BOTINFO.CHANNELS,
			lang.OTHER.BOTINFO.COMMANDS,
			lang.OTHER.BOTINFO.EVENTS,
			lang.OTHER.BOTINFO.UPTIME,
			lang.OTHER.BOTINFO.STARTED_AT,
			lang.OTHER.BOTINFO.API_PING,
			lang.OTHER.BOTINFO.BOT_VERSION,
			lang.OTHER.BOTINFO.FIELD_NAME,
		];

		const botInfo = {
			guilds: this.client.functions.sp(this.client.guilds.cache.size),
			users: this.client.functions.sp(this.client.users.cache.size),
			emojis: this.client.functions.sp(this.client.emojis.cache.size),
			channels: this.client.functions.sp(this.client.channels.cache.size),
			commands: this.client.functions.sp(this.client.commands.size),
			events: this.client.functions.sp(this.client.events.size),
			uptime: uptime(this.client.uptime, format),
			runTime: new Date(this.client.readyTimestamp).toLocaleString(
				guildLocale
			),
			apiPing: `${this.client.ws.ping}ms`,
		};

		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			`${title}:`,
			false,
			false,
			true
		);
		embed.addField({
			name: `${fieldName}:`,
			value: [
				`› **${guilds}**: **${botInfo.guilds}**`,
				`› **${users}**: **${botInfo.users}**`,
				`› **${emojis}**: **${botInfo.emojis}**`,
				`› **${channels}**: **${botInfo.channels}**`,
				`› **${commands}**: **${botInfo.commands}**`,
				`› **${events}**: **${botInfo.events}**`,
				`› **${apiPing}**: **${botInfo.apiPing}**`,
				`› **${runnedAt}**: **${botInfo.runTime}**`,
				`› **${botUptime}**: **${botInfo.uptime}**`,
				`› **${botVersion}**: **${this.client.version}**`,
			].join("\n"),
		});
		embed.setThumbnail(this.client.user.displayAvatarURL());

		return message.channel.send({
			embeds: [embed],
		});
	}
}

function uptime(ms: number, format: string) {
	return dayjs.duration(ms).format(format);
}
