import { Router } from "express";
import { Permissions } from 'discord.js';
import Goose from "classes/Goose";

export = (client: Goose): Router => {
    const router = Router();

    router.get('/', (req, res) => {
        return res.render('index', {
            user: req.session['user'] || null,
            bot: client
        });
    });
        
    router.get('/dashboard', (req, res) => {
        if(!req.session['user']) return res.redirect('/authorize');

        return res.render('dashboard', {
            user: req.session['user'],
            guilds: req.session['guilds'],
            bot: client,
            Permissions: Permissions
        });
    });

    router.get('/dashboard/:guildID', (req, res) => {
        if(!req.session['user']) return res.redirect('/authorize');

        const guildID = req.params.guildID;
        const guild = client.guilds.cache.get(guildID);
        const member = guild.members.cache.get(req.session['user'].id);
        const settings = client.database.getSettings(guild);

        if(!guild) return res.redirect('/dashboard');
        if(!member.permissions.has('MANAGE_GUILD')) return res.redirect('/dashboard');
        guild.channels.cache.filter((c) => c.type === 'GUILD_TEXT')

        return res.render('guild', {
            user: req.session['user'],
            bot: client,
            guild: guild,
            settings: settings,
        });
    });

    router.post('/dashboard/:guildID', (req, res) => {
        if(!req.session['user']) return res.redirect('/authorize');

        const guildID = req.params.guildID;
        const guild = client.guilds.cache.get(guildID);
        const member = guild.members.cache.get(req.session['user'].id);

        if(!guild) return res.redirect('/dashboard');
        if(!member.permissions.has('MANAGE_GUILD')) return res.redirect('/dashboard');

        if(req.body.prefix) client.database.set(guild, 'prefix', req.body.prefix);
        else if(req.body.logChannel) client.database.set(guild, 'logChannel', req.body.logChannel);
        else if(req.body.membersChannel) client.database.set(guild, 'membersChannel', req.body.membersChannel);

        return setTimeout(() => res.redirect(`/dashboard/${guild.id}`), 1000);
    });

    return router;
};