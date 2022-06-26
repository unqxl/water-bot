import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	UserFlagsString,
} from "discord.js";
import { bold, hyperlink, time } from "@discordjs/builders";
import { LanguageService } from "../../services/Language";
import { GuildService } from "../../services/Guild";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

// DayJS
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import("dayjs/locale/en");
import("dayjs/locale/ru");
import("dayjs/locale/uk");

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

			experimentMode: {
				status: true,
				id: 1,
			},
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		// TODO
		const member = command.options.getMember("member");
		const badges: Record<UserFlagsString, string> = {
			BotHTTPInteractions: "Bot HTTP Interactions",
			BugHunterLevel1: "Bug Hunter Level 1",
			BugHunterLevel2: "Bug Hunter Level 2",
			CertifiedModerator: "Certified Moderator",
			Hypesquad: "HypeSquad",
			HypeSquadOnlineHouse1: "HypeSquad Online House 1",
			HypeSquadOnlineHouse2: "HypeSquad Online House 2",
			HypeSquadOnlineHouse3: "HypeSquad Online House 3",
			Partner: "Partner",
			PremiumEarlySupporter: "Premium Early Supporter",
			Spammer: "Spammer",
			Staff: "Staff",
			TeamPseudoUser: "Team Pseudo User",
			VerifiedBot: "Verified Bot",
			VerifiedDeveloper: "Verified Developer",
		};

		command.reply({
			content: "123",
		});

		/*
		const service = new GuildService(this.client);
		const locale = await service.getSetting(command.guildId, "locale");

		locale === "en-US"
			? dayjs.locale("en")
			: locale === "ru-RU"
			? dayjs.locale("ru")
			: dayjs.locale("uk");

		const {
			OTHER_COMMANDS: { USERINFO },
			OTHER,
		} = await lang.all();

		const member = command.options.getMember("member") || command.member;
		const gif = member.displayAvatarURL({ extension: "gif", size: 2048 });
		const png = member.displayAvatarURL({ extension: "png", size: 2048 });
		const jpg = member.displayAvatarURL({ extension: "jpg", size: 2048 });
		const avatars = [
			hyperlink("GIF", gif),
			hyperlink("PNG", png),
			hyperlink("JPG", jpg),
		].join(" | ");

		const reg_date = `${time(member.user.createdAt)} (${time(
			member.user.createdAt,
			"R"
		)})`;

		const join_date = `${time(member.joinedAt)} (${time(
			member.joinedAt,
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
					return `⚫ ${USERINFO.OFFLINE}`;
				} else if (member.presence.status === "online") {
					return `🟢 ${USERINFO.ONLINE}`;
				} else if (member.presence.status === "idle") {
					return `🟡 ${USERINFO.IDLE}`;
				} else if (member.presence.status === "dnd") {
					return `🔴 ${USERINFO.DND}`;
				} else if (member.presence.status === "offline") {
					return `⚫ ${USERINFO.OFFLINE}`;
				} else if (member.presence.status === "invisible") {
					return `⚫ ${USERINFO.OFFLINE}`;
				}
			},

			game: () => {
				if (!member.presence) {
					return USERINFO.NOT_PLAYING;
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
					return USERINFO.NOT_PLAYING;
				}
			},

			online_with: () => {
				if (!member.presence.clientStatus) return OTHER.NOTHING;

				var platforms = [];
				const { web, mobile, desktop } = member.presence.clientStatus;

				if (web) platforms.push(USERINFO.WEB);
				if (mobile) platforms.push(USERINFO.MOBILE);
				if (desktop) platforms.push(USERINFO.DESKTOP);

				return platforms.join(", ");
			},

			boosting: member.premiumSince ? OTHER.YES : OTHER.NO,
			in_voice: member.voice.channel ? OTHER.YES : OTHER.NO,
			is_bot: member.user.bot ? OTHER.YES : OTHER.NO,
		};

		const author = this.client.functions.author(member);
		const color = this.client.functions.color("Blurple");

		const online_with = user_info.online_with();
		const playing = user_info.game();
		const status = user_info.status();

		const res = [
			`› ${bold(USERINFO.MAIN)}:`,
			`» ${bold(USERINFO.USERNAME)}: ${bold(user_info.name)}`,
			`» ${bold(USERINFO.TAG)}: ${bold(user_info.tag)}`,
			`» ${bold(USERINFO.AVATAR)}: ${bold(user_info.avatars)}`,
			"",
			`› ${bold(USERINFO.OTHER)}:`,
			`» ${bold(USERINFO.ONLINE_USING)}: ${bold(online_with)}`,
			`» ${bold(USERINFO.PRESENCE)}: ${bold(status)}`,
			`» ${bold(USERINFO.PLAYING)}: ${bold(playing)}`,
			"",
			`» ${bold(USERINFO.REG_DATE)}: ${bold(user_info.reg_date)}`,
			`» ${bold(USERINFO.JOIN_DATE)}: ${bold(user_info.join_date)}`,
			"",
			`» ${bold(USERINFO.BOT)}: ${bold(user_info.is_bot)}`,
			`» ${bold(USERINFO.IN_VOICE)}: ${bold(user_info.in_voice)}`,
			`» ${bold(USERINFO.BOOSTING)}: ${bold(user_info.boosting)}`,
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
		*/
	}
}
