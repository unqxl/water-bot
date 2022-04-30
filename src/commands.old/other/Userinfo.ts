import { EmbedBuilder, Util } from "discord.js";
import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";

// DayJS
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import("dayjs/locale/en");
import("dayjs/locale/ru");

export default class UserinfoCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "userinfo",
			aliases: ["ui"],

			description: {
				en: "Displays User Information!",
				ru: "Показывает Информацию Пользователя!",
			},

			usage: "<prefix>userinfo [member]",
			category: Categories.OTHER,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const locale = await this.client.database.getSetting(
			message.guild.id,
			"locale"
		);

		// Statuses
		const [online, idle, dnd, offline] = [
			lang.GLOBAL.STATUSES.ONLINE,
			lang.GLOBAL.STATUSES.IDLE,
			lang.GLOBAL.STATUSES.DND,
			lang.GLOBAL.STATUSES.OFFLINE,
		];

		// Client Statuses
		const [status_web, status_desktop, status_mobile] = [
			lang.OTHER.USER_INFO.CLIENT_STATUSES.WEB,
			lang.OTHER.USER_INFO.CLIENT_STATUSES.DESKTOP,
			lang.OTHER.USER_INFO.CLIENT_STATUSES.MOBILE,
		];

		// Other
		const [notPlaying, Nothing] = [
			lang.OTHER.USER_INFO.OTHER.NOT_PLAYING,
			lang.OTHER.USER_INFO.OTHER.NOTHING,
		];

		// Yes or No
		const [yes, no] = [lang.GLOBAL.YES, lang.GLOBAL.NO];

		// Field Names
		const [main, other] = [
			lang.OTHER.USER_INFO.FIELDS.MAIN,
			lang.OTHER.USER_INFO.FIELDS.OTHER,
		];

		// Main Texts
		const [username, tag, avatar] = [
			lang.OTHER.USER_INFO.TEXTS.MAIN.USERNAME,
			lang.OTHER.USER_INFO.TEXTS.MAIN.TAG,
			lang.OTHER.USER_INFO.TEXTS.MAIN.AVATAR,
		];

		// Other Texts
		const [
			online_using,
			presence,
			playing,
			reg_date,
			join_date,
			in_voice,
			boosting,
			bot,
		] = [
			lang.OTHER.USER_INFO.TEXTS.OTHER.ONLINE_USING,
			lang.OTHER.USER_INFO.TEXTS.OTHER.PRESENCE,
			lang.OTHER.USER_INFO.TEXTS.OTHER.PLAYING,
			lang.OTHER.USER_INFO.TEXTS.OTHER.REG_DATE,
			lang.OTHER.USER_INFO.TEXTS.OTHER.JOIN_DATE,
			lang.OTHER.USER_INFO.TEXTS.OTHER.IN_VOICE,
			lang.OTHER.USER_INFO.TEXTS.OTHER.BOOSTING,
			lang.OTHER.USER_INFO.TEXTS.OTHER.BOT,
		];

		const member = message.mentions.members.first() || message.member;
		const userInfo = {
			name: member.user.username,
			tag: member.user.tag,
			avatar: member.user.displayAvatarURL(),
			regDate: new Date(member.user.createdTimestamp).toLocaleString(
				locale === "en-US" ? "en-US" : "ru-RU"
			),
			joinDate: new Date(member.joinedTimestamp).toLocaleString(
				locale === "en-US" ? "en-US" : "ru-RU"
			),

			regTimeAgo: await timeSince(
				this.client,
				message,
				member.user.createdTimestamp
			),
			joinTimeAgo: await timeSince(
				this.client,
				message,
				member.joinedTimestamp
			),

			presence: () => {
				if (!member.presence || !member.presence?.status)
					return `⚫ ${offline}`;

				if (member.presence.status === "online") return `🟢 ${online}`;
				if (member.presence.status === "idle") return `🟡 ${idle}`;
				if (member.presence.status === "dnd") return `🔴 ${dnd}`;
				if (member.presence.status === "offline")
					return `⚫ ${offline}`;
				if (member.presence.status === "invisible")
					return `⚫ ${offline}`;
			},

			presenceGame: () => {
				if (!member.presence) return notPlaying;

				if (
					["online", "dnd", "idle"].includes(
						member.presence.status
					) &&
					member.presence.activities.length
				) {
					return `${member.presence.activities
						.join(", ")
						.toString()}`;
				} else {
					return notPlaying;
				}
			},
			onlineUsing: () => {
				if (!member.presence) return Nothing;

				if (
					member.presence.status === "invisible" ||
					member.presence.status === "offline"
				)
					return Nothing;
				else {
					let content = "";

					const { web, mobile, desktop } =
						member.presence.clientStatus;

					if (web) content = status_web;
					if (desktop) content = status_desktop;
					if (mobile) content = status_mobile;

					if (desktop && web)
						content = `${status_desktop}, ${status_web}`;
					if (desktop && mobile)
						content = `${status_desktop}, ${status_mobile}`;
					if (mobile && web)
						content = `${status_mobile}, ${status_web}`;
					if (mobile && web && desktop)
						content = `${status_desktop}, ${status_web}, ${status_mobile}`;
					if (web && mobile)
						content = `${status_web}, ${status_mobile}`;

					return content;
				}
			},

			boostCheck: member.premiumSince ? yes : no,
			voiceCheck: member.voice.channel ? yes : no,
			botCheck: member.user.bot ? yes : no,
		};

		const embed = new EmbedBuilder()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: member.user.username,
				iconURL: member.user.displayAvatarURL(),
			});

		embed.addFields([
			{
				name: `[1] ${main}:`,
				value: [
					`› **${username}**: **${userInfo.name}**`,
					`› **${tag}**: **${userInfo.tag}**`,
					`› **${avatar}**: **[Click](${userInfo.avatar})**`,
				].join("\n"),
			},
			{
				name: `[2] ${other}:`,
				value: [
					`› **${online_using}**: **${userInfo.onlineUsing()}**`,
					`› **${presence}**: **${userInfo.presence()}**`,
					`› **${playing}**: **${userInfo.presenceGame()}**`,
					"",
					`› **${reg_date}**: **${userInfo.regDate}** (**${userInfo.regTimeAgo}**)`,
					`› **${join_date}**: **${userInfo.joinDate}** (**${userInfo.joinTimeAgo}**)`,
					"",
					`› **${in_voice}**: **${userInfo.voiceCheck}**`,
					`› **${boosting}**: **${userInfo.boostCheck}**`,
					`› **${bot}**: **${userInfo.botCheck}**`,
				].join("\n"),
			},
		]);

		embed.setThumbnail(userInfo.avatar);

		return message.channel.send({
			embeds: [embed.toJSON()],
		});
	}
}

async function timeSince(
	client: Bot,
	message: Message,
	date: number,
	ws?: boolean
) {
	const locale = await client.database.getSetting(message.guild.id, "locale");

	if (locale === "en-US") dayjs.locale("en");
	else if (locale === "ru-RU") dayjs.locale("ru");

	return dayjs(date).fromNow(ws);
}