import { Message } from 'discord.js';
import { Command } from '../../structures/Command/Command';
import { Categories } from '../../structures/Command/BaseCommand';
import { bold } from '@discordjs/builders';
import Goose from '../../classes/Goose';
import random from 'random';
import fetch from 'node-fetch';

export default class GuessTheFlagCommand extends Command {
    constructor(client: Goose) {
        super(client, {
            name: 'guesstheflag',
            aliases: ['gtf'],

            description: {
                en: "Try to Guess the Flag to earn money!",
                ru: "Попробуйте угадать флаг, чтобы заработать деньги!",
            },

            category: Categories.GAMES,
            usage: '<prefix>guesstheflag'
        });
    }

    async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
        const reward = random.int(100, 190);
        const locale = this.client.database.getSetting(message.guild, 'language');
        const { Data, flag } = await fetch('https://api.dagpi.xyz/data/flag', {
            headers: {
                "Authorization": this.client.config.keys.dagpi_key
            }
        }).then((res) => res.json());

        var common_name = Data.name.common;
        var official_name = Data.name.official;
        var languages = Object.values(Data.languages);

        const text = lang.GAMES.GUESS_THE_FLAG.DESCRIPTION.replace('{reward}', reward.toString());
        const embed = this.client.functions.buildEmbed(message, 'BLURPLE', '...', false, true);
        embed.setDescription(bold(text));
        embed.setImage(flag);
        embed.setFooter(lang.GAMES.GUESS_THE_FLAG.FOOTER);

        const answer = await this.client.functions.promptMessage(message, {
            embeds: [embed]
        });

        if(!answer) {
            const text = lang.GAMES.GUESS_THE_FLAG.TIMEOUT
            .replace('{name}', locale === 'en-US' ? common_name : Data.translations.rus.common)
            .replace('{official_name}', locale === 'en-US' ? official_name : Data.translations.rus.official)
            .replace('{currency}', Data.currency.join(', '))
            .replace('{languages}', languages.join(', '));

            const embed = this.client.functions.buildEmbed(message, 'BLURPLE', bold(text), '❌', true);
            return message.channel.send({
                embeds: [embed]
            });
        }

        if(
            answer === common_name ||
            answer === official_name ||
            answer === common_name.toLowerCase() ||
            answer === official_name.toLowerCase()
        ) {
            this.client.economy.balance.add(reward, message.author.id, message.guild.id);
            
            const text = lang.GAMES.GUESS_THE_FLAG.WIN
            .replace('{name}', locale === 'en-US' ? common_name : Data.translations.rus.common)
            .replace('{official_name}', locale === 'en-US' ? official_name : Data.translations.rus.official)
            .replace('{currency}', Data.currency.join(', '))
            .replace('{languages}', languages.join(', '));

            const embed = this.client.functions.buildEmbed(message, 'BLURPLE', bold(text), '✅', true);
            return message.channel.send({
                embeds: [embed]
            });
        }
        else {
            const text = lang.GAMES.GUESS_THE_FLAG.DEFEAT
            .replace('{name}', locale === 'en-US' ? common_name : Data.translations.rus.common)
            .replace('{official_name}', locale === 'en-US' ? official_name : Data.translations.rus.official)
            .replace('{currency}', Data.currency.join(', '))
            .replace('{languages}', languages.join(', '));

            const embed = this.client.functions.buildEmbed(message, 'BLURPLE', bold(text), '❌', true);
            return message.channel.send({
                embeds: [embed]
            });
        }
    }
}