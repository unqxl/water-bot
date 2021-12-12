import { Command } from "../../structures/Command/Command";
import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Message } from "discord.js";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class BankAddCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "bank-add",
      
      description: {
        en: "Deposites Coins to Bank Balance!",
        ru: "Вносит Коины в Банк!",
      },
      
      category: Categories.ECONOMY,
      usage: "<prefix>bank-add <amount>",
    });
  }

  async validate(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn> {
    const balance = this.client.economy.balance.fetch(
      message.author.id,
      message.guild.id
    );

    const amount = args[0];
    if (!amount) {
      const text = lang.ERRORS.ARGS_MISSING.replace('{cmd_name}', 'bank-add');
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

    if (Number(amount) > balance) {
      const text = lang.ERRORS.NOT_ENOUGH_MONEY(
        lang.ECONOMY_ACTIONS.DEPOSIT
      );

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
    const amount = Number(args[0]);

    this.client.economy.balance.subtract(
      amount,
      message.author.id,
      message.guild.id
    );

    this.client.economy.bank.add(amount, message.author.id, message.guild.id);

    const text = lang.ECONOMY.BANK_DEPOSITED.replace('{amount}', this.client.functions.sp(amount));
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
