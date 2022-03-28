import {
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
} from "discord.js";
import { bold, inlineCode } from "@discordjs/builders";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

export default class ServerInfoCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",
			name: "serverinfo",
			description: "Displays Server Information!",
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: typeof import("@locales/English").default
	) {
		const info = await this.getInfo(command.guild);
		const embed = new EmbedBuilder();

		const { FIELDS, STATUSES, MEMBER_TYPES, CHANNELS, OTHER } =
			lang.OTHER.SERVER_INFO;
		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");

		const res = [
			`› ${bold(FIELDS.ZERO)}:`,
			`» ${bold(OTHER.GUILD_ID)}: ${bold(inlineCode(info.id))}`,
			`» ${bold(OTHER.OWNER)}: ${bold(info.owner.toString())}`,
			`» ${bold(OTHER.MEMBER_COUNT)}: ${bold(inlineCode(info.members))}`,
			`» ${bold(OTHER.CREATED_AT)}: ${bold(info.created_at)}`,
			"",
			`› ${bold(FIELDS.FIRST)}:`,
			`» ${bold(STATUSES.ONLINE)}: ${bold(inlineCode(info.onlineUsers))}`,
			`» ${bold(STATUSES.IDLE)}: ${bold(inlineCode(info.idleUsers))}`,
			`» ${bold(STATUSES.DND)}: ${bold(inlineCode(info.dndUsers))}`,
			"",
			`› ${bold(FIELDS.SECOND)}:`,
			`» ${bold(MEMBER_TYPES.HUMANS)}: ${bold(
				inlineCode(info.users.humans)
			)}`,
			`» ${bold(MEMBER_TYPES.BOTS)}: ${bold(
				inlineCode(info.users.bots)
			)}`,
			"",
			`› ${bold(FIELDS.THIRD)}:`,
			`» ${bold(CHANNELS.TEXT)}: ${bold(
				inlineCode(info.channels.textChannels)
			)}`,
			`» ${bold(CHANNELS.NEWS)}: ${bold(
				inlineCode(info.channels.newsChannels)
			)}`,
			`» ${bold(CHANNELS.VOICE)}: ${bold(
				inlineCode(info.channels.voiceChannels)
			)}`,
			`» ${bold(CHANNELS.STAGE)}: ${bold(
				inlineCode(info.channels.stagesChannels)
			)}`,
			`» ${bold(CHANNELS.CATEGORIES)}: ${bold(
				inlineCode(info.channels.categoriesChannels)
			)}`,
		].join("\n");

		embed.setColor(color);
		embed.setAuthor(author);
		embed.setDescription(res);
		embed.setTimestamp();

		return command.reply({
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
			if (channel.type === ChannelType.GuildText) text_channels++;
			else if (channel.type === ChannelType.GuildNews) news_channels++;
			else if (channel.type === ChannelType.GuildVoice) voice_channels++;
			else if (channel.type === ChannelType.GuildCategory)
				categories_channels++;
			else if (channel.type === ChannelType.GuildStageVoice)
				stages_channels++;
		});

		humansPercent = this.calculatePercent(humans, members.size);
		botsPercent = this.calculatePercent(bots, members.size);

		var createdAt = Math.floor(guild.createdTimestamp / 1000);

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
