import { Router } from "express";
import Goose from "classes/Goose";

export = (client: Goose): Router => {
    const router = Router();

    router.get('/', (req, res) => {
        return res.render('index', {
            user: req.session['user'] || null,
            bot: client
        });
    });
        
    router.get('/guilds', (req, res) => {
        if(!req.session['user']) return res.redirect('/authorize');

        return res.render('guilds', {
            user: req.session['user'],
            guilds: req.session['guilds'],
            bot: client
        });
    });

    return router;
};