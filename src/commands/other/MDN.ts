import { Categories, ValidateReturn } from '../../structures/Command/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../structures/Command/Command';
import { bold } from '@discordjs/builders';
import Goose from '../../classes/Goose';
import fetch from 'node-fetch';

export default class MDNCommand extends Command {
    constructor(client: Goose) {
        super(client, {
            name: 'mdn',

            description: {
                en: "Gives You information about your query from MDN!",
                ru: "Предоставляем вам информацию по поводу вашего запроса с MDN!"
            },

            category: Categories.OTHER,
            usage: '<prefix>mdn <query>'
        });
    }

    async validate(message: Message<boolean>, args: string[], lang: typeof import('@locales/English').default): Promise<ValidateReturn> {
        const query = args[0];
        if(!query) {
            const text = lang.ERRORS.ARGS_MISSING.replace('{cmd_name}', 'mdn');
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
            ok: true
        };
    }

    async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
        const url = "https://mdn.gideonbot.com/embed?q=";
        const query = args[0];

        const data = await fetch(`${url}${query}`).then((res) => res.json());
        if(data.code && data.code === 404) {
            const text = lang.ERRORS.NOT_FOUND('MDN');
            const embed = this.client.functions.buildEmbed(
                message,
                "BLURPLE",
                bold(text),
                "❌",
                true
            );

            return message.channel.send({
                embeds: [embed]
            });
        }

        const embed = new MessageEmbed(data);
        return message.channel.send({
            embeds: [embed]
        });
    }
}