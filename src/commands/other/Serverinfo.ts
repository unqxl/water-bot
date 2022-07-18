import {
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
} from "discord.js";
import { bold, inlineCode, time } from "@discordjs/builders";
import { LanguageService } from "../../services/Language";
import { SubCommand } from "../../types/Command/SubCommand";
import Bot from "../../classes/Bot";

export default class ServerInfoCommand extends SubCommand {
	constructor(client: Bot) {
		super(client, {
			commandName: "other",

			name: "serverinfo",
			description: "Displays Server statistics.",
			descriptionLocalizations: {
				ru: "Отображает статистику сервера.",
			},
		});
	}

	async run(
		command: ChatInputCommandInteraction<"cached">,
		lang: LanguageService
	) {
		const info = await this.getInfo(command.guild);
		const embed = new EmbedBuilder();

		const { SERVERINFO } = await (await lang.all()).OTHER_COMMANDS;
		const author = this.client.functions.author(command.member);
		const color = this.client.functions.color("Blurple");

		const [guild_id, owner, members, created_at] = [
			bold(inlineCode(info.id)),
			bold(info.owner.toString()),
			bold(inlineCode(info.members)),
			bold(info.created_at),
		];

		const [online_users, idle_users, dnd_users] = [
			bold(inlineCode(info.onlineUsers)),
			bold(inlineCode(info.idleUsers)),
			bold(inlineCode(info.dndUsers)),
		];

		const [humans, bots] = [
			bold(inlineCode(info.users.humans)),
			bold(inlineCode(info.users.bots)),
		];

		const [
			text_channels,
			news_channels,
			voice_channels,
			stages_channels,
			categories_channels,
		] = [
			bold(inlineCode(info.channels.textChannels)),
			bold(inlineCode(info.channels.newsChannels)),
			bold(inlineCode(info.channels.voiceChannels)),
			bold(inlineCode(info.channels.stagesChannels)),
			bold(inlineCode(info.channels.categoriesChannels)),
		];

		const res = [
			`› ${bold(SERVERINFO.INFORMATION)}:`,
			`» ${bold(SERVERINFO.GUILD_ID)}: ${guild_id}`,
			`» ${bold(SERVERINFO.OWNER)}: ${owner}`,
			`» ${bold(SERVERINFO.MEMBER_COUNT)}: ${members}`,
			`» ${bold(SERVERINFO.CREATED_AT)}: ${created_at}`,
			"",
			`› ${bold(SERVERINFO.PRESENCES)}:`,
			`» ${bold(SERVERINFO.ONLINE)}: ${online_users}`,
			`» ${bold(SERVERINFO.IDLE)}: ${idle_users}`,
			`» ${bold(SERVERINFO.DND)}: ${dnd_users}`,
			"",
			`› ${bold(SERVERINFO.MEMBERS)}:`,
			`» ${bold(SERVERINFO.HUMANS)}: ${humans}`,
			`» ${bold(SERVERINFO.BOTS)}: ${bots}`,
			"",
			`› ${bold(SERVERINFO.CATEGORIES)}:`,
			`» ${bold(SERVERINFO.TEXT)}: ${text_channels}`,
			`» ${bold(SERVERINFO.NEWS)}: ${news_channels}`,
			`» ${bold(SERVERINFO.VOICE)}: ${voice_channels}`,
			`» ${bold(SERVERINFO.STAGE)}: ${stages_channels}`,
			`» ${bold(SERVERINFO.CATEGORIES)}: ${categories_channels}`,
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
		let online = 0;
		let idle = 0;
		let dnd = 0;

		// Types
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
			if (channel.type === ChannelType.GuildText) {
				text_channels++;
			} else if (channel.type === ChannelType.GuildNews) {
				news_channels++;
			} else if (channel.type === ChannelType.GuildVoice) {
				voice_channels++;
			} else if (channel.type === ChannelType.GuildCategory) {
				categories_channels++;
			} else if (channel.type === ChannelType.GuildStageVoice) {
				stages_channels++;
			}
		});

		humansPercent = this.calculatePercent(humans, members.size);
		botsPercent = this.calculatePercent(bots, members.size);

		const createdAt = guild.createdAt;

		return {
			name: guild.name,
			id: guild.id,
			owner: await guild.fetchOwner(),
			created_at: `${time(createdAt)} (${time(createdAt, "R")})`,

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
