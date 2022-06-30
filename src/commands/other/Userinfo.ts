import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	GuildMember,
	UserFlagsString,
} from "discord.js";
import { bold, hyperlink, time } from "@discordjs/builders";
import { LanguageService } from "../../services/Language";
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
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const { NONE } = (await lang.all()).OTHER;
		const { USERINFO } = (await lang.all()).OTHER_COMMANDS;

		const member = command.options.getMember("member") || command.member;

		const status = await this.getStatus(member);
		const banners = await this.getBanner(member);
		const avatars = await this.getAvatars(member);
		const times = await this.getTimes(member);
		const badges = await this.getBadges(member);

		const InformationButton = new ButtonBuilder();
		InformationButton.setCustomId("user_information");
		InformationButton.setStyle(ButtonStyle.Primary);
		InformationButton.setEmoji("1️⃣");
		InformationButton.setLabel(USERINFO.INFORMATION_BTN);

		const BadgesButton = new ButtonBuilder();
		BadgesButton.setCustomId("user_badges");
		BadgesButton.setStyle(ButtonStyle.Secondary);
		BadgesButton.setEmoji("2️⃣");
		BadgesButton.setLabel(USERINFO.BADGES_BTN);

		const ButtonsRow = new ActionRowBuilder<ButtonBuilder>();
		ButtonsRow.addComponents(InformationButton, BadgesButton);

		const color = this.client.functions.color("Blurple");
		const author = this.client.functions.author(member);

		const InformationEmbed = new EmbedBuilder();
		InformationEmbed.setColor(color);
		InformationEmbed.setAuthor(author);
		InformationEmbed.setTitle(
			await lang.get(
				"OTHER_COMMANDS:USERINFO:INFORMATION_TITLE",
				member.user.tag
			)
		);
		InformationEmbed.setDescription(
			[
				`› ${bold(USERINFO.ID)}: ${bold(member.id)}`,
				`› ${bold(USERINFO.USERNAME)}: ${bold(member.user.username)}`,
				`› ${bold(USERINFO.DISCRIMINATOR)}: ${bold(
					member.user.discriminator
				)}`,
				`› ${bold(USERINFO.AVATARS)}: ${bold(avatars.join(" | "))}`,
				`› ${bold(USERINFO.BANNERS)}: ${bold(
					banners ? banners.join(" | ") : NONE
				)}`,
				`› ${bold(USERINFO.STATUS)}: ${bold(status)}`,
				`› ${bold(USERINFO.CREATED_AT)}: ${bold(times[0])}`,
				`› ${bold(USERINFO.JOINED_AT)}: ${bold(times[1])}`,
				`› ${bold(USERINFO.ROLES)}: ${bold(
					member.roles.cache.size.toString()
				)}`,
			].join("\n")
		);
		InformationEmbed.setTimestamp();

		const BadgesEmbed = new EmbedBuilder();
		BadgesEmbed.setColor(color);
		BadgesEmbed.setAuthor(author);
		BadgesEmbed.setTitle(
			await lang.get(
				"OTHER_COMMANDS:USERINFO:BADGES_TITLE",
				member.user.tag
			)
		);
		BadgesEmbed.setDescription(bold(badges));
		BadgesEmbed.setTimestamp();

		await command.reply({
			embeds: [InformationEmbed],
			components: [ButtonsRow],
		});

		const msg = await command.fetchReply();
		const collector = await msg.createMessageComponentCollector({
			filter: (btn) => btn.user.id === command.user.id,
			time: 120000,
			componentType: ComponentType.Button,
		});

		collector.on("collect", async (collected) => {
			if (!collected.isButton()) return;

			switch (collected.customId) {
				case "user_information": {
					await collected.update({
						embeds: [InformationEmbed],
						components: [ButtonsRow],
					});

					break;
				}

				case "user_badges": {
					await collected.update({
						embeds: [BadgesEmbed],
						components: [ButtonsRow],
					});

					break;
				}
			}
		});

		collector.on("end", async (collected, reason) => {
			if (reason === "time") {
				await msg.edit({
					embeds: [InformationEmbed],
					components: [ButtonsRow],
				});
			}
		});
	}

	async getTimes(member: GuildMember) {
		const created_at = member.user.createdAt;
		const joined_at = member.joinedAt;

		const createdAt = time(created_at);
		const createdAtR = time(created_at, "R");

		const joinedAt = time(joined_at);
		const joinedAtR = time(joined_at, "R");

		return [`${createdAtR} (${createdAt})`, `${joinedAtR} (${joinedAt})`];
	}

	async getStatus(member: GuildMember) {
		const lang = new LanguageService(this.client, member.guild.id);
		const { SERVERINFO } = (await lang.all()).OTHER_COMMANDS;

		const status = {
			online: `🟢 ${SERVERINFO.ONLINE}`,
			idle: `🟡 ${SERVERINFO.IDLE}`,
			dnd: `🔴 ${SERVERINFO.DND}`,
			offline: `⚫ ${SERVERINFO.OFFLINE}`,
		};

		return status[member.presence.status];
	}

	async getBadges(member: GuildMember) {
		const lang = new LanguageService(this.client, member.guild.id);
		const { BADGES } = await lang.all();

		const badges: Record<UserFlagsString, string> = {
			BotHTTPInteractions: null,
			BugHunterLevel1: "<:BugHunterLevel1:991920192563195904>",
			BugHunterLevel2: "<:BugHunterLevel2:991920193548853249>",
			CertifiedModerator: "<:CertifiedModerator:991920797876748348>",
			Hypesquad: null,
			HypeSquadOnlineHouse1:
				"<:HypeSquadOnlineHouse1:991920195398545458>",
			HypeSquadOnlineHouse2:
				"<:HypeSquadOnlineHouse2:991920196652630069>",
			HypeSquadOnlineHouse3:
				"<:HypeSquadOnlineHouse3:991920198552657930>",
			Partner: "<:Partner:991920200184246372>",
			PremiumEarlySupporter:
				"<:PremiumEarlySupporter:991920187433570335>",
			Spammer: null,
			Staff: "<:Staff:991920189216141403>",
			TeamPseudoUser: null,
			VerifiedBot: null,
			VerifiedDeveloper: "<:VerifiedDeveloper:991920191044861952>",
		};

		var flags = "";
		for (const [key, value] of Object.entries(badges)) {
			if (key === "Hypesquad") continue;

			if (member.user.flags.has(key as UserFlagsString)) {
				if (value) flags += value;
				flags += ` ${BADGES[key]} - ✅\n`;
			} else {
				if (value) flags += value;
				flags += ` ${BADGES[key]} - ❌\n`;
			}
		}

		return flags;
	}

	getAvatars(member: GuildMember) {
		const gif = member.displayAvatarURL({ extension: "gif", size: 2048 });
		const png = member.displayAvatarURL({ extension: "png", size: 2048 });
		const jpg = member.displayAvatarURL({ extension: "jpg", size: 2048 });

		return [
			hyperlink("GIF", gif),
			hyperlink("PNG", png),
			hyperlink("JPG", jpg),
		];
	}

	getBanner(member: GuildMember) {
		if (!member.user.banner) return null;

		const gif = member.user.bannerURL({ extension: "gif", size: 2048 });
		const png = member.user.bannerURL({ extension: "png", size: 2048 });
		const jpg = member.user.bannerURL({ extension: "jpg", size: 2048 });

		return [
			hyperlink("GIF", gif),
			hyperlink("PNG", png),
			hyperlink("JPG", jpg),
		];
	}
}
