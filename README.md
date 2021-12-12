# Akayo - Discord Bot
<strong>Welcome! <br />
Akayo - one of the best Discord Bots in terms of functionality.</strong>

<strong>This bot includes a lot of useful functions, many of which I think can help you when setting up the server, here are a few of them:
1. Server events - Akayo will notify in a specially designated channel (which you will set yourself) for many events on the server (role assignment /removal, server boost, etc.)
2. Moderation - Akayo is able to moderate your server, can issue a warning / mute to the user (mute can be eternal and temporary, with 3 warnings the user is kicked out of the server, with 6 bans)
3. Music - Akayo can play music from platforms such as YouTube, SoundCloud, Spotify. And Akayo tries to play them in the best quality!
4. Customization - If desired, you can practically configure the bot the way you want (at the moment, changing some things is not available, but there will be more customization in the future). For more information, read to the end!
5. Twitch Notifications - A completely new system in Akayo, this is a notification at the start of the broadcast on the Twitch streaming platform. The bot will check for the presence of a stream from the streamer every 30 seconds, if the broadcast is started, but the notification is not sent, the bot will send it to the channel pre-installed in the database! For more information, read to the end!
</strong>

# Translation [![Crowdin](https://badges.crowdin.net/akayo-bot/localized.svg)](https://crowdin.com/project/akayo-bot)
<strong>You can also help me with the translation of my bot using the Crowdin service: [Click here](https://crowdin.com/project/akayo-bot/)</strong>

# Getting Started
<strong>WARNING: Before installing, please note that you are not allowed to use the code of this bot as the main one! In this case, assistance will not be provided!</strong>

## Requirements
1. <strong>[Discord Bot Token](https://discord.com/developers/applications)</strong>
2. <strong>[NodeJS v16](https://nodejs.org/)</strong>
3. <strong>[FFMPEG](https://ffmpeg.org/download.html)</strong>

## APIs
1. <strong>[Weather API](https://openweathermap.org/api)</strong>
2. <strong>[Steam API](https://steamcommunity.com/dev/apikey)</strong>
3. <strong>[osu!api](https://osu.ppy.sh/p/api)</strong>
4. <strong>[dagpi](https://dagpi.xyz/)</strong>
4. <strong>[Twitch API](https://dev.twitch.tv/console)</strong>

## Installation
1. <strong>Clone this repo: `git clone https://github.com/bad-boy-discord/akayo-bot`</strong>
2. <strong>Install all dependencies: `npm install`</strong>
3. <strong>Change all keys/tokens in `src/config.ts`</strong>
4. <strong>Run `npm run build` to convert TS code into JS</strong> <br />
4.1: <strong>Run `npm run start:ts` to run TS code using ts-node</strong>
5. <strong>Run the bot: `npm run start:js`</strong> <br />
5.1: <strong>Run `npm run start:ts` to run TS code using ts-node</strong>

# License
<strong>This repository uses the [Apache License](https://github.com/bad-boy-discord/akayo-bot/blob/master/LICENSE)!</strong>
