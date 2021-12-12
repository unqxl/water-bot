import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class BalanceSubtractCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "balance-subtract",
      aliases: ['bal-sub'],
      
      description: {
        en: "Subtracts Balance to You/Target!",
        ru: "Удаляет Коины с Баланса Пользователя!",
      },
      
      category: Categories.ECONOMY,
      usage: "<prefix>balance-subtract <member> <amount>",

      memberPermissions: ["ADMINISTRATOR"],
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
      const text = lang.ERRORS.ARGS_MISSING.replace('{cmd_name}', 'balance-subtract');
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

    const amount = args[1];
    if (!amount) {
      const text = lang.ERRORS.ARGS_MISSING.replace('{cmd_name}', 'balance-subtract');
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

    if (!Number(amount)) {
      const text = lang.ERRORS.IS_NAN.replace('{input}', amount);
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
    const amount = Number(args[1]);

    if (member.user.bot) {
      const text = lang.ERRORS.USER_BOT.replace('{target}', member.toString());
      const embed = this.client.functions.buildEmbed(
        message,
        "BLURPLE",
        bold(text),
        "❌",
        true
      );

      return message.channel.send({
        embeds: [embed],
      });
    }

    this.client.economy.balance.subtract(
      amount,
      member.user.id,
      message.guild.id
    );

    const text = lang.ECONOMY.BALANCE_SUBT.replace('{amount}', this.client.functions.sp(amount)).replace('{member}', member.toString());
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
}
