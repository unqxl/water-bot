import { Guild, Message, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { bold, inlineCode } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class ServerinfoCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "serverinfo",
			aliases: ["si", "serveri", "sinfo"],

			description: {
				en: "Displays Server Information!",
				ru: "Показывает Информацию Сервера!",
			},

			category: Categories.OTHER,
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const info = await this.getInfo(message.guild);
		const embed = new MessageEmbed();

		// Embed Title and Field Names
		const [title, precences, members, channels] = [
			lang.OTHER.SERVER_INFO.TITLE,
			lang.OTHER.SERVER_INFO.FIELDS.FIRST,
			lang.OTHER.SERVER_INFO.FIELDS.SECOND,
			lang.OTHER.SERVER_INFO.FIELDS.THIRD,
		];

		// Precences
		const [online, idle, dnd] = [
			lang.OTHER.SERVER_INFO.STATUSES.ONLINE,
			lang.OTHER.SERVER_INFO.STATUSES.IDLE,
			lang.OTHER.SERVER_INFO.STATUSES.DND,
		];

		// Users
		const [humans, bots] = [
			lang.OTHER.SERVER_INFO.MEMBER_TYPES.HUMANS,
			lang.OTHER.SERVER_INFO.MEMBER_TYPES.BOTS,
		];

		// Channels
		const [text, news, voice, stage, categories] = [
			lang.OTHER.SERVER_INFO.CHANNELS.TEXT,
			lang.OTHER.SERVER_INFO.CHANNELS.NEWS,
			lang.OTHER.SERVER_INFO.CHANNELS.VOICE,
			lang.OTHER.SERVER_INFO.CHANNELS.STAGE,
			lang.OTHER.SERVER_INFO.CHANNELS.CATEGORIES,
		];

		// Other
		const [guild_id, owner, member_count] = [
			lang.OTHER.SERVER_INFO.OTHER.GUILD_ID,
			lang.OTHER.SERVER_INFO.OTHER.OWNER,
			lang.OTHER.SERVER_INFO.OTHER.MEMBER_COUNT,
		];

		var description = "";

		(description += `› ${bold(guild_id)}: ${bold(
			inlineCode(info.id)
		)}\n\n`),
			(description += `› ${bold(owner)}: ${bold(
				inlineCode(info.owner.user.username)
			)}\n`),
			(description += `› ${bold(member_count)}: ${bold(
				inlineCode(info.members)
			)}\n\n`),
			(description += `› ${bold(precences)}:\n`);
		description += `» ${bold(online)}: ${bold(
			inlineCode(info.onlineUsers)
		)}\n`;
		description += `» ${bold(idle)}: ${bold(inlineCode(info.idleUsers))}\n`;
		description += `» ${bold(dnd)}: ${bold(inlineCode(info.dndUsers))}\n\n`;
		description += `› ${bold(members)}:\n`;
		description += `» ${bold(humans)}: ${bold(
			inlineCode(info.users.humans)
		)} (${bold(inlineCode(String(info.users.humansPercent) + "%"))})\n`;
		description += `» ${bold(bots)}: ${bold(
			inlineCode(info.users.bots)
		)} (${bold(inlineCode(String(info.users.botsPercent) + "%"))})\n\n`;
		description += `› ${bold(channels)}:\n`;
		description += `› ${bold(text)}: ${bold(
			inlineCode(String(info.channels.textChannels))
		)}\n`;
		description += `› ${bold(news)}: ${bold(
			inlineCode(String(info.channels.newsChannels))
		)}\n`;
		description += `› ${bold(voice)}: ${bold(
			inlineCode(String(info.channels.voiceChannels))
		)}\n`;
		description += `› ${bold(stage)}: ${bold(
			inlineCode(String(info.channels.stagesChannels))
		)}\n`;
		description += `› ${bold(categories)}: ${bold(
			inlineCode(String(info.channels.categoriesChannels))
		)}\n`;

		embed.setColor("BLURPLE");
		embed.setAuthor(
			message.author.username,
			message.author.displayAvatarURL({ dynamic: true })
		);
		embed.setTitle(title);
		embed.setDescription(description);
		embed.setThumbnail(message.guild.iconURL({ dynamic: true }));

		return message.channel.send({
			embeds: [embed],
		});
	}

	async getInfo(guild: Guild) {
		const members = guild.members.cache;
		const emojis = guild.emojis.cache;
		const channels = guild.channels.cache;

		// Statuses
		var online = 0;
		var idle = 0;
		var dnd = 0;

		// Types
		var humans = 0;
		var bots = 0;

		// Channels
		var text_channels = 0;
		var news_channels = 0;
		var voice_channels = 0;
		var stages_channels = 0;
		var categories_channels = 0;

		// Percent
		var humansPercent = 0;
		var botsPercent = 0;

		// Other
		const emotes = [];

		members.forEach((member) => {
			const status = member.presence?.clientStatus;

			if (member.user.bot) bots++;
			else humans++;

			if (!status) return;

			if (
				status.web === "online" ||
				status.desktop === "online" ||
				status.mobile === "online"
			)
				online++;

			if (
				status.web === "idle" ||
				status.desktop === "idle" ||
				status.mobile === "idle"
			)
				idle++;

			if (
				status.web === "dnd" ||
				status.desktop === "dnd" ||
				status.mobile === "dnd"
			)
				dnd++;
		});

		emojis.forEach((emoji) => {
			emotes.push(`${emoji.toString()}`);
		});

		channels.forEach((channel) => {
			if (channel.type === "GUILD_TEXT") text_channels++;
			else if (channel.type === "GUILD_NEWS") news_channels++;
			else if (channel.type === "GUILD_VOICE") voice_channels++;
			else if (channel.type === "GUILD_CATEGORY") categories_channels++;
			else if (channel.type === "GUILD_STAGE_VOICE") stages_channels++;
		});

		humansPercent = this.calculatePercent(humans, members.size);
		botsPercent = this.calculatePercent(bots, members.size);

		return {
			name: guild.name,
			id: guild.id,
			owner: await guild.fetchOwner(),

			members: guild.memberCount.toLocaleString(),
			onlineUsers: online.toLocaleString(),
			idleUsers: idle.toLocaleString(),
			dndUsers: dnd.toLocaleString(),

			users: {
				humans: humans.toLocaleString(),
				humansPercent: humansPercent,

				bots: bots.toLocaleString(),
				botsPercent: botsPercent,
			},

			channels: {
				textChannels: text_channels,
				newsChannels: news_channels,
				voiceChannels: voice_channels,
				stagesChannels: stages_channels,
				categoriesChannels: categories_channels,
			},

			emojis: emotes,
		};
	}

	calculatePercent(number1, number2) {
		return Math.round((number1 / number2) * 100);
	}
}
