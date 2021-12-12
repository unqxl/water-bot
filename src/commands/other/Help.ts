import { Message, Permissions } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { bold, inlineCode } from "@discordjs/builders";
import Goose from "../../classes/Goose";

interface PermissionsKey {
  MANAGE_GUILD: string;
  ADMINISTRATOR: string;
  MANAGE_MESSAGES: string;
  BAN_MEMBERS: string;
  KICK_MEMBERS: string;
  CREATE_INSANT_INVITE: string;
  EMBED_LINKS: string;
  SPEAK: string;
  CONNECT: string;
  MANAGE_ROLES: string;
  MANAGE_WEBHOOKS: string;
  MANAGE_EMOJIS: string;
}

export default class HelpCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "help",
      
      description: {
        en: "Displays all the Bot Commands!",
        ru: "Показывает Все Команды Бота!",
      },
      
      category: Categories.OTHER,
      usage: "<prefix>help [cmd_name]",
    });
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const prefix = this.client.database.getSetting(message.guild, "prefix");
    const locale = this.client.database.getSetting(message.guild, 'language');
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
    ];

    const Length = lang.OTHER.HELP.COMMANDS_LENGTH;
    if (!command) {
      const BotOwnerCommands =
        this.client.commands
          .filter((cmd) => cmd.options.category === Categories.BOTOWNER)
          .map((cmd) => {
            return inlineCode(prefix + cmd.options.name);
          })
          .join(", ") || bold(None);

      const EconomyCommands =
        this.client.commands
          .filter((cmd) => cmd.options.category === Categories.ECONOMY)
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
          .filter((cmd) => cmd.options.category === Categories.MODERATION)
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
          .filter((cmd) => cmd.options.category === Categories.SETTINGS)
          .map((cmd) => {
            return inlineCode(prefix + cmd.options.name);
          })
          .join(", ") || bold(None);

      const LevelingCommands =
        this.client.commands
          .filter((cmd) => cmd.options.category === Categories.LEVELING)
          .map((cmd) => {
            return inlineCode(prefix + cmd.options.name);
          })
          .join(", ") || bold(None);

      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        "...",
        false,
        true
      );
      embed.setDescription("");

      embed.addField(`[💰] ${Economy}`, EconomyCommands);
      embed.addField(`[🎮] ${Games}`, GamesCommands);
      embed.addField(`[🛡️] ${Moderation}`, ModerationCommands);
      embed.addField(`[🎵] ${Music}`, MusicCommands);
      embed.addField(`[📝] ${Other}`, OtherCommands);
      embed.addField(`[⭐] ${Leveling}`, LevelingCommands);
      embed.addField(`[⚙️] ${Settings}`, SettingsCommands);
      embed.setFooter(
        `${Length}: ${this.client.functions.sp(this.client.commands.size)}`,
        this.client.user.displayAvatarURL({ dynamic: true })
      );

      if (this.client.functions.checkOwner(message.author))
        embed.addField(`[👑] ${BotOwner}`, BotOwnerCommands);

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
          "BLURPLE",
          bold(text),
          false,
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

      if (cmd.options.category === Categories.BOTOWNER) categoryName = BotOwner;
      else if (cmd.options.category === Categories.ECONOMY)
        categoryName = Economy;
      else if (cmd.options.category === Categories.FUN) categoryName = Fun;
      else if (cmd.options.category === Categories.GAMES) categoryName = Games;
      else if (cmd.options.category === Categories.MODERATION)
        categoryName = Moderation;
      else if (cmd.options.category === Categories.MUSIC) categoryName = Music;
      else if (cmd.options.category === Categories.OTHER) categoryName = Other;
      else if (cmd.options.category === Categories.SETTINGS)
        categoryName = Settings;

      const botPermissionsRequired = await this.formatBotPermissions(
        message,
        cmd
      );
      const memberPermissionsRequired = await this.formatMemberPermissions(
        message,
        cmd
      );

      const formattedAliases = cmd.options.aliases?.length
        ? cmd.options.aliases.map((alias) => inlineCode(alias)).join(", ")
        : None;
      const res = [
        `› ${bold(name)}: ${inlineCode(cmd.options.name)}`,
        `› ${bold(description)}: ${inlineCode(
          locale === 'en-US' ? cmd.options.description.en : cmd.options.description.ru
        )}`,
        `› ${bold(usage)}: ${inlineCode(cmd.options.usage ?? None)}`,
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
        "BLURPLE",
        res,
        false,
        true
      );

      return message.channel.send({
        embeds: [embed],
      });
    }
  }

  async formatBotPermissions(message: Message, command: Command) {
    const language = await this.client.functions.getLanguageFile(message.guild);
    const PermsObj: PermissionsKey = language.PERMISSIONS;

    if (command.options.botPermissions) {
      const perms = command.options.botPermissions;
      const formatted = [];

      perms.forEach((perm) => formatted.push(PermsObj[perm]));

      return formatted;
    } else return undefined;
  }

  async formatMemberPermissions(message: Message, command: Command) {
    const language = await this.client.functions.getLanguageFile(message.guild);
    const PermsObj: PermissionsKey = language.PERMISSIONS;

    if (command.options.memberPermissions) {
      const perms = command.options.memberPermissions;
      const formatted = [];

      perms.forEach((perm) => formatted.push(PermsObj[perm]));

      return formatted;
    } else return undefined;
  }
}