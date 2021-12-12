import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { bold } from "@discordjs/builders";
import Goose from "../classes/Goose";
import cases from "../data/cases.json";

export = async (
  client: Goose,
  _msg: Message,
  message: Message,
  lang: typeof import('@locales/English').default
) => {
  const bronzeName = lang.ECONOMY.CASES.BRONZE;
  const silverName = lang.ECONOMY.CASES.SILVER;
  const goldenName = lang.ECONOMY.CASES.GOLD;

  const bronzeCase = new MessageButton()
    .setStyle("SECONDARY")
    .setLabel(bronzeName)
    .setCustomId("bronze_case")
    .setEmoji("1️⃣");

  const silverCase = new MessageButton()
    .setStyle("SECONDARY")
    .setLabel(silverName)
    .setCustomId("silver_case")
    .setEmoji("2️⃣");

  const goldenCase = new MessageButton()
    .setStyle("SECONDARY")
    .setLabel(goldenName)
    .setCustomId("golden_case")
    .setEmoji("3️⃣");

  const casesRow = new MessageActionRow().addComponents([
    bronzeCase,
    silverCase,
    goldenCase,
  ]);

  const description = bold(lang.ECONOMY.CASES.CHOOSE_TEXT);
  const note = bold(lang.ECONOMY.CASES.NOTE);

  var embedDescription = "";
      embedDescription += description + '\n\n';
      embedDescription += `[**1**] ${bold(bronzeName)} ${bold(`($${cases[0].cost})`)}\n`;
      embedDescription += `[**2**] ${bold(silverName)} ${bold(`($${cases[1].cost})`)}\n`;
      embedDescription += `[**3**] ${bold(goldenName)} ${bold(`($${cases[3].cost})`)}\n\n`;
      embedDescription += note;

  const ChooseCaseEmbed = new MessageEmbed()
    .setColor("BLURPLE")
    .setAuthor(
      _msg.author.username,
      _msg.author.displayAvatarURL({ dynamic: true })
    )
    .setDescription(embedDescription)
    .setTimestamp();

  await message
    .edit({
      content: null,
      embeds: [ChooseCaseEmbed],
      components: [casesRow],
    })
    .then(async (msg) => {
      const collector = await msg.createMessageComponentCollector({
        filter: (btn) => btn.user.id === _msg.author.id,
        componentType: "BUTTON",
        time: 30000,
      });

      collector.on("collect", async (btn: ButtonInteraction) => {
        const buttonID = btn.customId;
        const chosenCase = cases.find((i) => i.name === buttonID);
        const balance = client.economy.balance.fetch(
          _msg.author.id,
          btn.guild.id
        );

        if (!chosenCase) return;

        if (balance < chosenCase.cost) {
          const embed = new MessageEmbed()
          .setColor("BLURPLE")
          .setAuthor(
            _msg.author.username,
            _msg.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(bold(lang.ERRORS.NOT_ENOUGH_MONEY(lang.ECONOMY_ACTIONS.BUY_CASE)))
          .setTimestamp();

          msg.edit({
            components: [],
            embeds: [embed],
          });
        }

        const prize =
          chosenCase.prizes[
            Math.floor(Math.random() * chosenCase.prizes.length)
          ];

        client.economy.balance.subtract(
          chosenCase.cost,
          _msg.author.id,
          btn.guild.id
        );
        client.economy.balance.add(prize.prize, _msg.author.id, btn.guild.id);

        const case_name = chosenCase.id === 1 ? bronzeName : chosenCase.id === 2 ? silverName : chosenCase.id === 3 ? goldenName : '';
        const text = lang.ECONOMY.CASES.PRIZE_TEXT.replace('{case}', case_name).replace('{prize}', prize.prize.toLocaleString());
        const embed = new MessageEmbed()
          .setColor("BLURPLE")
          .setAuthor(
            _msg.author.username,
            _msg.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(bold(text))
          .setTimestamp();

        collector.stop();

        msg.edit({
          embeds: [embed],
          components: [],
        });
        return;
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          const text = lang.ECONOMY.CASES.TIME_IS_OVER;
          const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setAuthor(
              _msg.author.username,
              _msg.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
              bold(text)
            )
            .setTimestamp();

          msg.edit({
            components: [],
            embeds: [embed],
          });
          return;
        }
      });
    });
};
