import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";


export default class DailyCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "daily",
      
      description: {
        en: "Get Your Daily Reward!",
        ru: "Получите свою Ежедневную Награду!",
      },
      
      category: Categories.ECONOMY,
    });
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const daily = this.client.economy.rewards.daily(
      message.author.id,
      message.guild.id
    );
    if (!daily.status) {
      const FormattedTime = `${daily.value.days}:${daily.value.hours}:${daily.value.minutes}:${daily.value.seconds}`;
      const text = lang.ECONOMY.TIME_ERROR.replace('{time}', FormattedTime);
      const embed = this.client.functions.buildEmbed(message, 'RED', bold(text), '❌', true);

      return message.channel.send({
        embeds: [embed],
      });
    }

    const text = lang.ECONOMY.DAILY_REWARD.replace('{coins}', this.client.functions.sp(daily.reward));
    const embed = this.client.functions.buildEmbed(
      message,
      "BLURPLE",
      bold(text),
      "✅",
      true
    );

    return message.channel.send({
      embeds: [embed],
    });
  }
}
