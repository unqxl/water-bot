import Goose from "classes/Goose";
import session from "express-session";
import cors from 'cors';
import express from 'express';

// Routes
import index from './routes/index';
import discord from './routes/discord';

export = class Website {
    public client: Goose;

    constructor(client: Goose) {
        this.client = client;

        var app = this.client.web.app;

        app.set('view engine', 'ejs');
        app.set('views', `${__dirname}/views`);
        app.set('trust proxy', true);

        app.use(express.static(`${__dirname}/static`));
        app.use(cors({ credentials: true }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        var cookieExpire = (1000 * 60 * 60 * 24 * 7);
        app.use(
            session({
                secret: this.client.config.web.session_secret,

                resave: false,
                saveUninitialized: false,

                cookie: {
                    secure: false,
                    maxAge: cookieExpire
                },
            })
        );

        app.use('/', index(this.client));
        app.use('/authorize', discord);
    }
}