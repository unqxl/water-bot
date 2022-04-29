import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	type PresenceStatus,
} from "discord.js";
import { bold, hyperlink, time } from "@discordjs/builders";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

// DayJS
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import("dayjs/locale/en");
import("dayjs/locale/ru");

export default class UserInfoCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "userinfo",
			description: "Displays Discord User Information!",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "member",
					description: "Member to information display",
					required: false,
				},
			],
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const locale =
			(await this.client.database.getSetting(
				command.guildId,
				"locale"
			)) == "en-US"
				? "en"
				: "ru";
		locale === "en" ? dayjs.locale("en") : dayjs.locale("ru");

		const { CLIENT_STATUSES, OTHER, FIELDS, TEXTS } = lang.OTHER.USER_INFO;
		const { YES, NO, STATUSES } = lang.GLOBAL;
		const member = command.options.getMember("member") || command.member;

		const gif = member.displayAvatarURL({ extension: "gif", size: 2048 });
		const png = member.displayAvatarURL({ extension: "png", size: 2048 });
		const jpg = member.displayAvatarURL({ extension: "jpg", size: 2048 });
		const avatars = `${hyperlink("GIF", gif)} | ${hyperlink(
			"PNG",
			png
		)} | ${hyperlink("JPG", jpg)}`;

		const reg_date_unix = Math.ceil(member.user.createdTimestamp / 1000);
		const reg_date = `${time(reg_date_unix)} (${time(reg_date_unix, "R")})`;

		const join_date_unix = Math.ceil(member.joinedTimestamp / 1000);
		const join_date = `${time(join_date_unix)} (${time(
			join_date_unix,
			"R"
		)})`;

		const user_info = {
			name: member.displayName,
			tag: member.user.tag,
			avatars: avatars,

			reg_date: reg_date,
			join_date: join_date,

			status: () => {
				if (!member.presence || !member.presence?.status) {
					return `⚫ ${STATUSES.OFFLINE}`;
				} else if (member.presence.status === "online") {
					return `🟢 ${STATUSES.ONLINE}`;
				} else if (member.presence.status === "idle") {
					return `🟡 ${STATUSES.IDLE}`;
				} else if (member.presence.status === "dnd") {
					return `🔴 ${STATUSES.DND}`;
				} else if (member.presence.status === "offline") {
					return `⚫ ${STATUSES.OFFLINE}`;
				} else if (member.presence.status === "invisible") {
					return `⚫ ${STATUSES.OFFLINE}`;
				}
			},

			game: () => {
				if (!member.presence) {
					return OTHER.NOT_PLAYING;
				}

				if (
					["online", "dnd", "idle"].includes(
						member.presence.status
					) &&
					member.presence.activities
				) {
					const activities = member.presence.activities
						.map((activity) => activity.name)
						.join(", ");

					return activities;
				} else {
					return OTHER.NOT_PLAYING;
				}
			},

			online_with: () => {
				if (!member.presence.clientStatus) return OTHER.NOTHING;

				var platforms = [];
				const { web, mobile, desktop } = member.presence.clientStatus;

				if (web) platforms.push(CLIENT_STATUSES.WEB);
				if (mobile) platforms.push(CLIENT_STATUSES.MOBILE);
				if (desktop) platforms.push(CLIENT_STATUSES.DESKTOP);

				return platforms.join(", ");
			},

			boosting: member.premiumSince ? YES : NO,
			in_voice: member.voice.channel ? YES : NO,
			is_bot: member.user.bot ? YES : NO,
		};

		const author = this.client.functions.author(member);
		const color = this.client.functions.color("Blurple");

		const online_with = user_info.online_with();
		const playing = user_info.game();
		const status = user_info.status();

		const res = [
			`› ${bold(FIELDS.MAIN)}:`,
			`» ${bold(TEXTS.MAIN.USERNAME)}: ${bold(user_info.name)}`,
			`» ${bold(TEXTS.MAIN.TAG)}: ${bold(user_info.tag)}`,
			`» ${bold(TEXTS.MAIN.AVATAR)}: ${bold(user_info.avatars)}`,
			"",
			`› ${bold(FIELDS.OTHER)}:`,
			`» ${bold(TEXTS.OTHER.ONLINE_USING)}: ${bold(online_with)}`,
			`» ${bold(TEXTS.OTHER.PRESENCE)}: ${bold(status)}`,
			`» ${bold(TEXTS.OTHER.PLAYING)}: ${bold(playing)}`,
			"",
			`» ${bold(TEXTS.OTHER.REG_DATE)}: ${bold(user_info.reg_date)}`,
			`» ${bold(TEXTS.OTHER.JOIN_DATE)}: ${bold(user_info.join_date)}`,
			"",
			`» ${bold(TEXTS.OTHER.BOT)}: ${bold(user_info.is_bot)}`,
			`» ${bold(TEXTS.OTHER.IN_VOICE)}: ${bold(user_info.in_voice)}`,
			`» ${bold(TEXTS.OTHER.BOOSTING)}: ${bold(user_info.boosting)}`,
		].join("\n");

		const embed = new EmbedBuilder();
		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(res);
		embed.setThumbnail(member.displayAvatarURL());
		embed.setTimestamp();

		return command.reply({
			embeds: [embed],
		});
	}
}
