import { EmbedBuilder, Guild, Util, ChannelType } from "discord.js";
import { bold, inlineCode } from "@discordjs/builders";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class ServerinfoCommand extends Command {
	constructor(client: Bot) {
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
		const embed = new EmbedBuilder();

		// Embed Title and Field Names
		const [title, information, precences, members, channels] = [
			lang.OTHER.SERVER_INFO.TITLE,
			lang.OTHER.SERVER_INFO.FIELDS.ZERO,
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
		const [guild_id, owner, member_count, createdAt] = [
			lang.OTHER.SERVER_INFO.OTHER.GUILD_ID,
			lang.OTHER.SERVER_INFO.OTHER.OWNER,
			lang.OTHER.SERVER_INFO.OTHER.MEMBER_COUNT,
			lang.OTHER.SERVER_INFO.OTHER.CREATED_AT,
		];

		embed.setColor(Util.resolveColor("Blurple"));
		embed.setAuthor({
			name: message.author.username,
			iconURL: message.author.displayAvatarURL(),
		});
		embed.setTitle(title);
		embed.setThumbnail(message.guild.iconURL());

		embed.addFields([
			{
				name: `› ${bold(information)}:`,
				value: [
					`» ${bold(guild_id)}: ${bold(inlineCode(info.id))}`,
					`» ${bold(owner)}: ${bold(info.owner.toString())}`,
					`» ${bold(member_count)}: ${bold(
						inlineCode(info.members)
					)}`,
					`» ${bold(createdAt)}: ${bold(info.created_at)}`,
				].join("\n"),
			},
			{
				name: `› ${bold(precences)}:`,
				value: [
					`» ${bold(online)}: ${bold(inlineCode(info.onlineUsers))}`,
					`» ${bold(idle)}: ${bold(inlineCode(info.idleUsers))}`,
					`» ${bold(dnd)}: ${bold(inlineCode(info.dndUsers))}`,
				].join("\n"),
			},
			{
				name: `› ${bold(members)}:`,
				value: [
					`» ${bold(humans)}: ${bold(inlineCode(info.users.humans))}`,
					`» ${bold(bots)}: ${bold(inlineCode(info.users.bots))}`,
				].join("\n"),
			},
			{
				name: `› ${bold(channels)}:`,
				value: [
					`» ${bold(text)}: ${bold(
						inlineCode(info.channels.textChannels)
					)}`,
					`» ${bold(news)}: ${bold(
						inlineCode(info.channels.newsChannels)
					)}`,
					`» ${bold(voice)}: ${bold(
						inlineCode(info.channels.voiceChannels)
					)}`,
					`» ${bold(stage)}: ${bold(
						inlineCode(info.channels.stagesChannels)
					)}`,
					`» ${bold(categories)}: ${bold(
						inlineCode(info.channels.categoriesChannels)
					)}`,
				].join("\n"),
			},
		]);

		return message.channel.send({
			embeds: [embed.toJSON()],
		});
	}

	async getInfo(guild: Guild) {
		const members = guild.members.cache;
		const emojis = guild.emojis.cache;
		const channels = guild.channels.cache;

		// Statuses
		let online = 0;
		let idle = 0;
		let dnd = 0;

		// Member Types
		let humans = 0;
		let bots = 0;

		// Channels
		let text_channels = 0;
		let news_channels = 0;
		let voice_channels = 0;
		let stages_channels = 0;
		let categories_channels = 0;

		// Percent
		let humansPercent = 0;
		let botsPercent = 0;

		// Other
		const emotes = [];

		for (const [id, member] of guild.members.cache) {
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
		}

		for (const [id, emoji] of guild.emojis.cache) {
			emotes.push(`${emoji.toString()}`);
		}

		for (const [id, channel] of guild.channels.cache) {
			if (channel.type === ChannelType.GuildText) text_channels++;
			else if (channel.type === ChannelType.GuildNews) news_channels++;
			else if (channel.type === ChannelType.GuildVoice) voice_channels++;
			else if (channel.type === ChannelType.GuildCategory)
				categories_channels++;
			else if (channel.type === ChannelType.GuildStageVoice)
				stages_channels++;
		}

		humansPercent = this.calculatePercent(humans, members.size);
		botsPercent = this.calculatePercent(bots, members.size);

		const createdAt = Math.floor(guild.createdTimestamp / 1000);

		return {
			name: guild.name,
			id: guild.id,
			owner: await guild.fetchOwner(),
			created_at: `<t:${createdAt}> (<t:${createdAt}:R>)`,

			members: guild.memberCount.toLocaleString(),
			onlineUsers: online.toLocaleString(),
			idleUsers: idle.toLocaleString(),
			dndUsers: dnd.toLocaleString(),

			users: {
				humans: `${humans.toLocaleString()} (${humansPercent}%)`,
				bots: `${bots.toLocaleString()} (${botsPercent}%)`,
			},

			channels: {
				textChannels: String(text_channels),
				newsChannels: String(news_channels),
				voiceChannels: String(voice_channels),
				stagesChannels: String(stages_channels),
				categoriesChannels: String(categories_channels),
			},

			emojis: emotes,
		};
	}

	calculatePercent(number1, number2) {
		return Math.round((number1 / number2) * 100);
	}
}
