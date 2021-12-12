import { Message, Util } from 'discord.js';
import { bold, hyperlink } from '@discordjs/builders';
import { Command } from '../../structures/Command/Command';
import { Categories } from '../../structures/Command/BaseCommand';
import Goose from '../../classes/Goose';
import random from 'random';

export default class GuessTheLogoCommand extends Command {
    constructor(client: Goose) {
        super(client, {
            name: 'guessthelogo',
            aliases: ['gtl'],

            description: {
                en: "Try to Guess the Logo to earn money!",
                ru: "Попробуйте угадать Логотип, чтобы заработать деньги!",
            },

            category: Categories.GAMES,
            usage: '<prefix>guessthelogo'
        });
    }

    async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
        const reward = random.int(100, 190);
        const data = await this.client.dagpi.logo();
        console.log(data);

        const text = lang.GAMES.GUESS_THE_LOGO.DESCRIPTION
        .replace('{reward}', reward.toString())
        .replace('{clue}', data.clue || '-')
        .replace('{hint}', Util.escapeMarkdown(data.hint));

        const embed = this.client.functions.buildEmbed(message, 'BLURPLE', '...', false, true);
        embed.setDescription(bold(text));
        embed.setImage(data.question);
        embed.setFooter(lang.GAMES.GUESS_THE_LOGO.FOOTER);

        const answer = await this.client.functions.promptMessage(message, {
            embeds: [embed]
        }, 35000);

        if(!answer) {
            const text = lang.GAMES.GUESS_THE_LOGO.TIMEOUT
            .replace('{brand}', data.brand)
            .replace('{wiki}', hyperlink('Click', encodeURI(data.wiki_url)));

            const embed = this.client.functions.buildEmbed(message, 'BLURPLE', bold(text), '❌', true);
            embed.setImage(data.answer);

            return message.channel.send({
                embeds: [embed]
            });
        }

        if(
            answer === data.brand ||
            answer === data.brand.toLowerCase()
        ) {
            this.client.economy.balance.add(reward, message.author.id, message.guild.id);
            
            const text = lang.GAMES.GUESS_THE_LOGO.WIN
            .replace('{brand}', data.brand)
            .replace('{wiki}', hyperlink('Click', encodeURI(data.wiki_url)));

            const embed = this.client.functions.buildEmbed(message, 'BLURPLE', bold(text), '✅', true);
            embed.setImage(data.answer);

            return message.channel.send({
                embeds: [embed]
            });
        }
        else {
            const text = lang.GAMES.GUESS_THE_LOGO.DEFEAT
            .replace('{brand}', data.brand)
            .replace('{wiki}', hyperlink('Click', encodeURI(data.wiki_url)));

            const embed = this.client.functions.buildEmbed(message, 'BLURPLE', bold(text), '❌', true);
            embed.setImage(data.answer);

            return message.channel.send({
                embeds: [embed]
            });
        }
    }
}