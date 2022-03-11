import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories } from "../../types/Command/BaseCommand";
import { bold, inlineCode } from "@discordjs/builders";
import Bot from "../../classes/Bot";

interface PermissionsKey {
	ManageGuild: string;
	ManageRoles: string;
	ManageWebhooks: string;
	ManageMessages: string;
	ManageEmojisAndStickers: string;
	Administrator: string;
	BanMembers: string;
	KickMembers: string;
	CreateInstantInvite: string;
	EmbedLinks: string;
	Speak: string;
	Connect: string;
}

export default class HelpCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "help",
			aliases: ["h", "cmd", "cmds"],

			description: {
				en: "Displays all the Bot Commands!",
				ru: "Показывает Все Команды Бота!",
			},

			category: Categories.OTHER,
			usage: "<prefix>help [cmd_name]",
		});
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const prefix = await this.client.database.getSetting(
			message.guild.id,
			"prefix"
		);
		const locale = await this.client.database.getSetting(
			message.guild.id,
			"locale"
		);
		const command = args[0];

		// Category Names
		const [
			None,
			BotOwner,
			Economy,
			Fun,
			Moderation,
			Music,
			Other,
			Settings,
			Games,
			Leveling,
			Giveaways,
			RolePlay,
			Clans,
		] = [
			lang.GLOBAL.NONE,
			lang.OTHER.HELP.CATEGORIES.BOT_OWNER,
			lang.OTHER.HELP.CATEGORIES.ECONOMY,
			lang.OTHER.HELP.CATEGORIES.FUN,
			lang.OTHER.HELP.CATEGORIES.MODERATION,
			lang.OTHER.HELP.CATEGORIES.MUSIC,
			lang.OTHER.HELP.CATEGORIES.OTHER,
			lang.OTHER.HELP.CATEGORIES.SETTINGS,
			lang.OTHER.HELP.CATEGORIES.GAMES,
			lang.OTHER.HELP.CATEGORIES.LEVELING,
			lang.OTHER.HELP.CATEGORIES.GIVEAWAYS,
			lang.OTHER.HELP.CATEGORIES.ROLEPLAY,
			lang.OTHER.HELP.CATEGORIES.CLANS,
		];

		const Length = lang.OTHER.HELP.COMMANDS_LENGTH;
		if (!command) {
			const BotOwnerCommands =
				this.client.commands
					.filter(
						(cmd) => cmd.options.category === Categories.BOTOWNER
					)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const EconomyCommands =
				this.client.commands
					.filter(
						(cmd) => cmd.options.category === Categories.ECONOMY
					)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const GamesCommands =
				this.client.commands
					.filter((cmd) => cmd.options.category === Categories.GAMES)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const ModerationCommands =
				this.client.commands
					.filter(
						(cmd) => cmd.options.category === Categories.MODERATION
					)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const MusicCommands =
				this.client.commands
					.filter((cmd) => cmd.options.category === Categories.MUSIC)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const OtherCommands =
				this.client.commands
					.filter((cmd) => cmd.options.category === Categories.OTHER)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const SettingsCommands =
				this.client.commands
					.filter(
						(cmd) => cmd.options.category === Categories.SETTINGS
					)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const LevelingCommands =
				this.client.commands
					.filter(
						(cmd) => cmd.options.category === Categories.LEVELING
					)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const GiveawaysCommands =
				this.client.commands
					.filter(
						(cmd) => cmd.options.category === Categories.GIVEAWAYS
					)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const RolePlayCommands =
				this.client.commands
					.filter(
						(cmd) => cmd.options.category === Categories.ROLEPLAY
					)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const ClansCommands =
				this.client.commands
					.filter((cmd) => cmd.options.category === Categories.CLANS)
					.map((cmd) => {
						return inlineCode(prefix + cmd.options.name);
					})
					.join(", ") || bold(None);

			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				undefined,
				false,
				false,
				true
			);

			embed.addFields(
				{
					name: `[💰] ${Economy}`,
					value: EconomyCommands,
				},
				{ name: `[🎮] ${Games}`, value: GamesCommands },
				{
					name: `[🛡️] ${Moderation}`,
					value: ModerationCommands,
				},
				{ name: `[🎵] ${Music}`, value: MusicCommands },
				{ name: `[📝] ${Other}`, value: OtherCommands },
				{
					name: `[⭐] ${Leveling}`,
					value: LevelingCommands,
				},
				{
					name: `[⚙️] ${Settings}`,
					value: SettingsCommands,
				},
				{
					name: `[🎉] ${Giveaways}`,
					value: GiveawaysCommands,
				},
				{
					name: `[🎭] ${RolePlay}`,
					value: RolePlayCommands,
				},
				{
					name: `[✨] ${Clans}`,
					value: ClansCommands,
				}
			);

			embed.setFooter({
				text: `${Length}: ${this.client.functions.sp(
					this.client.commands.size
				)}`,
				iconURL: this.client.user.displayAvatarURL(),
			});

			if (this.client.functions.checkOwner(message.author))
				embed.addFields({
					name: `[👑] ${BotOwner}`,
					value: BotOwnerCommands,
				});

			return message.channel.send({
				embeds: [embed],
			});
		} else {
			const cmd =
				this.client.commands.get(command) ||
				this.client.commands.get(this.client.aliases.get(command));
			if (!cmd) {
				const text = lang.ERRORS.COMMAND_NOT_FOUND(command);
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					text,
					false,
					"❌",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			}

			const [
				name,
				description,
				aliases,
				usage,
				category,
				botPermissions,
				memberPermissions,
			] = [
				lang.OTHER.HELP.COMMAND.NAME,
				lang.OTHER.HELP.COMMAND.DESCRIPTION,
				lang.OTHER.HELP.COMMAND.ALIASES,
				lang.OTHER.HELP.COMMAND.USAGE,
				lang.OTHER.HELP.COMMAND.CATEGORY,
				lang.OTHER.HELP.COMMAND.BOT_PERMISSIONS,
				lang.OTHER.HELP.COMMAND.MEMBER_PERMISSIONS,
			];

			var categoryName = "";

			if (cmd.options.category === Categories.BOTOWNER)
				categoryName = BotOwner;
			else if (cmd.options.category === Categories.ECONOMY)
				categoryName = Economy;
			else if (cmd.options.category === Categories.FUN)
				categoryName = Fun;
			else if (cmd.options.category === Categories.GAMES)
				categoryName = Games;
			else if (cmd.options.category === Categories.MODERATION)
				categoryName = Moderation;
			else if (cmd.options.category === Categories.MUSIC)
				categoryName = Music;
			else if (cmd.options.category === Categories.OTHER)
				categoryName = Other;
			else if (cmd.options.category === Categories.SETTINGS)
				categoryName = Settings;
			else if (cmd.options.category === Categories.GIVEAWAYS)
				categoryName = Giveaways;

			const botPermissionsRequired = await this.formatBotPermissions(
				message,
				cmd
			);
			const memberPermissionsRequired =
				await this.formatMemberPermissions(message, cmd);

			const formattedAliases = cmd.options.aliases?.length
				? cmd.options.aliases
						.map((alias) => inlineCode(alias))
						.join(", ")
				: None;
			const res = [
				`› ${bold(name)}: ${inlineCode(cmd.options.name)}`,
				`› ${bold(description)}: ${inlineCode(
					locale === "en-US"
						? cmd.options.description.en
						: cmd.options.description.ru
				)}`,
				`› ${bold(usage)}: ${inlineCode(
					cmd.options.usage.replace("<prefix>", prefix) ?? None
				)}`,
				`› ${bold(aliases)}: ${inlineCode(formattedAliases)}`,
				`› ${bold(category)}: ${inlineCode(categoryName)}`,
				`› ${bold(botPermissions)}: ${inlineCode(
					botPermissionsRequired?.length
						? botPermissionsRequired.join(", ")
						: None
				)}`,
				`› ${bold(memberPermissions)}: ${inlineCode(
					memberPermissionsRequired?.length
						? memberPermissionsRequired.join(", ")
						: None
				)}`,
			].join("\n");

			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				res,
				false,
				false,
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}
	}

	async formatBotPermissions(message: Message, command: Command) {
		const language = await this.client.functions.getLanguageFile(
			message.guild.id
		);

		const PermsObj: PermissionsKey = language.PERMISSIONS;

		if (command.options.botPermissions) {
			const perms = command.options.botPermissions;
			const formatted = [];

			perms.forEach((perm) => formatted.push(PermsObj[perm]));

			return formatted;
		} else return undefined;
	}

	async formatMemberPermissions(message: Message, command: Command) {
		const language = await this.client.functions.getLanguageFile(
			message.guild.id
		);

		const PermsObj: PermissionsKey = language.PERMISSIONS;

		if (command.options.memberPermissions) {
			const perms = command.options.memberPermissions;
			const formatted = [];

			perms.forEach((perm) => formatted.push(PermsObj[perm]));

			return formatted;
		} else return undefined;
	}
}
