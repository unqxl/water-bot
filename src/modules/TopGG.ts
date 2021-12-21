import { Webhook } from '@top-gg/sdk';
import { AutoPoster } from 'topgg-autoposter';
import { BasePoster } from 'topgg-autoposter/dist/structs/BasePoster';
import { TextChannel } from 'discord.js';
import Goose from '../classes/Goose';

export = class TopGG {
    public client: Goose;
    public webhook: Webhook;
    public poster: BasePoster;

    constructor(client: Goose) {
        this.client = client;

        if(this.client.config.bot.test) return;
        if(!this.client.config.topgg.token) throw new Error('Cannot get Top-GG Authorization Token');
        if(!this.client.config.topgg.webhook_auth) throw new Error('Cannot get Top-GG Webhook Authorization Token');

        this.poster = AutoPoster(this.client.config.topgg.token, this.client);
        this.webhook = new Webhook(this.client.config.topgg.webhook_auth);

        this.poster.on('posted', () => {
            this.client.logger.log('Posted Bot Stats into Top-GG!', 'Top-GG');
        });

        this.client.web.app.post('/dblwebhook', this.webhook.listener((vote) => {
            const user = this.client.users.cache.get(vote.user);

            if(!this.client.config.topgg.votesChannelID) {
                this.client.logger.log(`${user.tag} has voted me!`, 'Top-GG');
            }
            else {
                const channel = this.client.channels.cache.get(this.client.config.topgg.votesChannelID) as TextChannel;
                const embed = this.client.functions.buildEmbed({ author: user }, 'BLURPLE', `${user.toString()} has voted me in Top-GG!`, '✨', true);

                channel.send({
                    embeds: [embed]
                });

                this.client.logger.log(`${user.tag} has voted me!`, 'Top-GG');
            }
        }));
    }
}