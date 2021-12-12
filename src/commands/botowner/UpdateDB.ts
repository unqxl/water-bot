import { Categories, ValidateReturn } from '../../structures/Command/BaseCommand';
import { Message } from 'discord.js';
import { Command } from '../../structures/Command/Command';
import { bold } from '@discordjs/builders';
import Goose from '../../classes/Goose';

export default class UpdateDBCommand extends Command {
    constructor(client: Goose) {
        super(client, {
            name: 'updatedb',
            aliases: ['udb'],
            
            description: {
              en: "Updating Guild Databases!",
              ru: "Обновляет Базы Данных Бота!",
            },
            
            category: Categories.BOTOWNER
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

    async run(message: Message, args: string[], lang: typeof import('@locales/English').default) {
        for(const [name, guild] of this.client.guilds.cache) {
            this.client.database.set(guild, 'welcomeText', {
                en: "Welcome, {user_mention}!\nServer is now including **{members} members**!",
                ru: "Добро пожаловать, {user_mention}!\nСервер включает в себя **{members}** участников!"
            });
            
            this.client.database.set(guild, 'byeText', {
                en: "{user_mention} left this server!\nServer is now including **{members} members**!",
                ru: "{user_mention} покинул данный сервер!\nСервер включает в себя **{members}** участников!"
            });
        }

        const embed = this.client.functions.buildEmbed(message, 'BLURPLE', bold(lang.BOTOWNER.UPDATED_DB), '✅', true);

        return message.channel.send({
            embeds: [embed]
        });
    }
}