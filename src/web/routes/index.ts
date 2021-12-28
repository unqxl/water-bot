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

    return router;
};