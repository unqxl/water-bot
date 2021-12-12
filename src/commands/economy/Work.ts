import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";


export default class WorkCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "work",
      
      description: {
        en: "Get Your Work Reward!",
        ru: "Получите свою Награду за Работу!",
      },
      
      category: Categories.ECONOMY,
    });
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    const work = this.client.economy.rewards.work(
      message.author.id,
      message.guild.id
    );
    
    if (!work.status) {
      const FormattedTime = `${work.value.days}:${work.value.hours}:${work.value.minutes}:${work.value.seconds}`;
      const text = lang.ECONOMY.TIME_ERROR.replace('{time}', FormattedTime);
      const embed = this.client.functions.buildEmbed(message, 'RED', bold(text), '❌', true);

      return message.channel.send({
        embeds: [embed],
      });
    }

    const text = lang.ECONOMY.WORK_REWARD.replace('{coins}', this.client.functions.sp(work.reward as number));
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