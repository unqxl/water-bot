import { Router } from "express";
import FormData from "form-data";
import fetch from "node-fetch";
import config from "../../config";

const { client_id, client_secret, scopes, redirect_uri } = config.web;
const router = Router();

router.get('/', (req, res) => {
    if(req.session['user']) return res.redirect('/');

    const authorize_url = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join('%20')}&response_type=code`;
    return res.redirect(authorize_url);
});

router.get('/callback', async (req, res) => {
    if(req.session['user']) return res.redirect('/');

    const accessCode = req.query['code'];
    if(req.query['error'] === 'access_denied') {
        return res.status(401).json({
            code: res.statusCode,
            message: "You have canceled your login via Discord!"
        });
    };

    if(!accessCode) {
        return res.status(401).json({
            code: res.statusCode,
            message: "Login failed, try again later! (Access Code)"
        });
    }

    const data = new FormData();
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', redirect_uri);
    data.append('scope', scopes.join(' '));
    data.append('code', accessCode);

    try {
        var authorizationToken = await (
            await fetch(`https://discord.com/api/oauth2/token`, {
                method: 'POST',
                body: data
            })
        ).json();

        var [ userResponse, guildResponse ] = await Promise.all([
            fetch(`https://discord.com/api/users/@me`, {
                method: 'GET',
                headers: {
                    "Authorization": `${authorizationToken.token_type} ${authorizationToken.access_token}`
                }
            }),

            fetch(`https://discord.com/api/users/@me/guilds`, {
                method: 'GET',
                headers: {
                    "Authorization": `${authorizationToken.token_type} ${authorizationToken.access_token}`
                }
            }),
        ]);

        userResponse = await userResponse.json();
        guildResponse = await guildResponse.json();
        
        userResponse['username'] = userResponse['username'];
        userResponse['id'] = userResponse['id'];
        userResponse['tag'] = `${userResponse['username']}#${userResponse['discriminator']}`;
        userResponse['avatarURL'] = userResponse['avatar'] ? `https://cdn.discordapp.com/avatars/${userResponse['id']}/${userResponse['avatar']}.png?size=1024` : null;

        req.session['user'] = userResponse;
        req.session['guilds'] = guildResponse;
        req.session['guilds'].map((guild) => guild['iconURL'] = guild['icon'] ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : "https://cdn.discordapp.com/attachments/765919453766352916/877787616974622770/wCfHtuoejLIbAAAAABJRU5ErkJggg.png")

        res.set('credentials', 'include');
        res.redirect('/');

    } 
    catch (error) {
        return res.status(500).json({
            code: res.statusCode,
            message: "Failed to login a user in with Discord credentials!"
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {});
    return res.redirect('/');
})

export = router;