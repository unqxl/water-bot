import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { Command } from "../../structures/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class WarnCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "warn",
      
      description: {
        en: "Gives Warn to the Member!",
        ru: "Выдаёт Предупреждение Участнику!",
      },
      
      category: Categories.MODERATION,
      usage: "<prefix>warn <member>",

      memberPermissions: ["MANAGE_MESSAGES"],
      botPermissions: ["MANAGE_ROLES"],
    });
  }

  async validate(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn> {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!member) {
      const text = lang.ERRORS.ARGS_MISSING.replace('{cmd_name}', 'warn');
      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(text),
        "❌",
        true
      );

      return {
        ok: false,
        error: {
          embeds: [embed],
        },
      };
    }

    const muteRole = this.client.database.getSetting(message.guild, "muteRole");

    if (muteRole === "0") {
      const text = lang.ERRORS.NO_MUTEROLE;
      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(text),
        "❌",
        true
      );

      return {
        ok: false,
        error: {
          embeds: [embed],
        },
      };
    }

    return {
      ok: true,
    };
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    var reason = args[1];
    if (!reason) reason = "-";

    const [ accept, decline, confirmText ] = [
      lang.FUNCTIONS.VERIFICATION.ACCEPT,
      lang.FUNCTIONS.VERIFICATION.DECLINE,
      lang.FUNCTIONS.VERIFICATION.TEXT,
    ];

    const confirmButton = new MessageButton()
      .setCustomId("confirm")
      .setStyle("SUCCESS")
      .setLabel(accept)
      .setEmoji("✅");

    const cancelButton = new MessageButton()
      .setCustomId("cancel")
      .setStyle("DANGER")
      .setLabel(decline)
      .setEmoji("❌");

    const confirmRow = new MessageActionRow().addComponents([
      confirmButton,
      cancelButton,
    ]);

    const confirmEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(bold(confirmText))
      .setTimestamp();

    const msg = await message.channel.send({
      embeds: [confirmEmbed],
      components: [confirmRow],
    });

    const collector = await msg.createMessageComponentCollector({
      filter: (btn) => btn.user.id === message.author.id,
      componentType: "BUTTON",
      max: 1,
      time: 20000,
    });

    collector.on("collect", async (btn: ButtonInteraction) => {
      if (btn.customId === "confirm") {
        await this.client.moderation.warn(message, member, reason);

        const text = lang.MODERATION.WARNED
        .replace('{target}', member.toString())
        .replace('{reason}', reason)
        .replace('{moderator}', message.author.toString());

        const embed = this.client.functions.buildEmbed(
          message,
          "BLURPLE",
          bold(text),
          "✅",
          true
        );

        await msg.edit({
          embeds: [embed],
          components: [],
        });

        return;
      } else if (btn.customId === "cancel") {
        collector.stop();
        await msg.delete();

        return;
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        await msg.delete();
      } else if (collected.first().customId === "cancel") {
        await msg.delete();
      }
    });
  }
}