import { Message, MessageButton, MessageActionRow, Util } from "discord.js";
import {
  Categories,
  ValidateReturn,
} from "../../structures/Command/BaseCommand";
import { Command } from "../../structures/Command/Command";
import { bold, inlineCode } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class GuildsCommand extends Command {
  constructor(client: Goose) {
    super(client, {
      name: "guilds",

      description: {
        en: "Shows Bot Guilds List!",
        ru: "Выводит Список Серверов у Бота!",
      },
      
      category: Categories.BOTOWNER,
      usage: "<prefix>guilds",
    });
  }

  async validate(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn> {
    const isOwner = this.client.functions.checkOwner(message.author);
    const text = lang.ERRORS.NO_ACCESS;
    const embed = this.client.functions.buildEmbed(
      message,
      "BLURPLE",
      bold(text),
      "❌",
      true
    );

    if (!isOwner) {
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

  async run(
    message: Message, 
    args: string[], 
    lang: typeof import('@locales/English').default
  ) {
    let i0 = 0;
    let i1 = 10;
    let page = 1;

    var description = this.client.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .map((v) => v)
      .map((v, i) => {
        const name = Util.escapeMarkdown(v.name);
        const memberCount = this.client.functions.sp(v.memberCount);

        return `${bold((i + 1).toString())}: ${bold(name)} (${inlineCode(
          v.id
        )}) | ${bold(memberCount + " Members")}`;
      })
      .slice(0, 10)
      .join("\n");

    const previousPage = new MessageButton()
      .setStyle("SECONDARY")
      .setEmoji("⬅️")
      .setCustomId("previous");

    const nextPage = new MessageButton()
      .setStyle("SECONDARY")
      .setEmoji("➡️")
      .setCustomId("next");

    const deletePage = new MessageButton()
      .setStyle("SECONDARY")
      .setEmoji("❌")
      .setCustomId("delete");

    const row = new MessageActionRow().addComponents([
      previousPage,
      nextPage,
      deletePage,
    ]);

    const embed = this.client.functions.buildEmbed(
      message,
      "BLURPLE",
      description,
      false,
      true
    );
    embed.setFooter(
      `Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`
    );

    const msg = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const collector = await msg.createMessageComponentCollector({
      filter: (btn) => btn.user.id === message.author.id,
      componentType: "BUTTON",
      time: 60 * 1000 * 5,
    });

    collector.on("collect", (btn) => {
      switch (btn.customId) {
        case "previous": {
          i0 -= 10;
          i1 -= 10;
          page -= 1;

          if (i0 < 0) {
            collector.stop();

            return btn.update({
              components: [],
            });
          }

          description = this.client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((v) => v)
            .map((v, i) => {
              const name = Util.escapeMarkdown(v.name);
              const memberCount = this.client.functions.sp(v.memberCount);

              return `${bold((i + 1).toString())}: ${bold(name)} (${inlineCode(
                v.id
              )}) | ${bold(memberCount + " Members")}`;
            })
            .slice(i0, i1)
            .join("\n");

          embed.setDescription(description);
          embed.setFooter(
            `Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`
          );

          return btn.update({
            embeds: [embed],
          });
        }

        case "next": {
          i0 += 10;
          i1 += 10;
          page += 1;

          if (i1 > this.client.guilds.cache.size + 10) {
            collector.stop();

            return btn.update({
              components: [],
            });
          }

          if (!i0 || !i1) {
            collector.stop();

            return btn.update({
              components: [],
            });
          }

          description = this.client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((v) => v)
            .map((v, i) => {
              const name = Util.escapeMarkdown(v.name);
              const memberCount = this.client.functions.sp(v.memberCount);

              return `${bold((i + 1).toString())}: ${bold(name)} (${inlineCode(
                v.id
              )}) | ${bold(memberCount + " Members")}`;
            })
            .slice(i0, i1)
            .join("\n");

          embed.setDescription(description);
          embed.setFooter(
            `Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`
          );

          return btn.update({
            embeds: [embed],
          });
        }

        case "delete": {
          collector.stop();
          return;
        }
      }
    });

    collector.on("end", async () => {
      await msg.delete();
      return;
    });
  }
}
