import { Message } from "discord.js";
import { Command } from "../../structures/Command/Command";
import { Categories } from "../../structures/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class TwitchSystemDisableCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "twitchsystem-disable",
      aliases: ["twitch-disable"],
      
      description: {
        en: "Disables Twitch Notifications System!",
        ru: "Выключает Систему Twitch Уведомлений!",
      },
      
      category: Categories.SETTINGS,
    });
  }

  async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
    await this.client.database.set(message.guild, "twitchEnabled", "0");

    const type = lang.SETTINGS.CONFIG.TYPES.TWITCH_ENABLED;
    const text = lang.SETTINGS.DISABLED(type);
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
