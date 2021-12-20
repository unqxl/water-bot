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
        
    router.get('/user', (req, res) => {
        return res.json({
            user: req.session['user'] || null,
            guilds: req.session['guilds'] || null,
        });
    });

    return router;
};