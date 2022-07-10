[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://help.unicef.org/ukraine-emergency/)

<strong>[📢 Обращение к гражданам России](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/ToRussianPeople.md)</strong>

<hr>

# Localization

<strong>
🇷🇺: Если вы заинтересованы в помощи с переводом бота на Украинский язык, то вы можете перейти по ссылке и начать помощь с переводом.

🇺🇦: Якщо ви зацікавлені в допомозі з перекладом бота на українську мову, то ви можете перейти за посиланням і почати допомогу з перекладом.

[Click here to help with translation](https://crowdin.com/project/water-discord-bot)
</strong>

# Water (WIP) - Discord Bot

<strong>Welcome! <br />
Water - one of the best Discord Bots in terms of functionality.</strong>

<strong>This bot includes a lot of useful functions, many of which I think can help you when setting up the server, here are a few of them:

1. Server events - The Bot will notify in a specially designated channel (which you will set yourself) for many events on the server (role assignment /removal, server boost, etc.)
2. Moderation - The Bot is able to moderate your server, can issue a warning / mute to the user (mute can be eternal and temporary, with 3 warnings the user is kicked out of the server, with 6 bans)
3. Music - The Bot can play music from platforms such as YouTube, SoundCloud, Spotify. And "Water" tries to play them in the best quality!
4. Customization - If desired, you can practically configure the bot the way you want (at the moment, changing some things is not available, but there will be more customization in the future). For more information, read to the end!
5. Twitch Notifications - A completely new system in "Water", this is a notification at the start of the broadcast on the Twitch streaming platform. The bot will check for the presence of a stream from the streamer every 30 seconds, if the broadcast is started, but the notification is not sent, the bot will send it to the channel pre-installed in the database!
   </strong>

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
4. <strong>[Twitch API](https://dev.twitch.tv/console)</strong>
5. <strong>[IMDB API](https://imdb-api.com)</strong>

## Installation

1. <strong>Clone this repo: `git clone https://github.com/bad-boy-discord/water-bot`</strong>
2. <strong>Install all dependencies: `npm install`</strong>
3. <strong>Rename `src/cfg.example.ts` with `src/cfg.ts`</strong>
4. <strong>Change all keys/tokens in `src/config.ts`</strong>
5. <strong>Run `npm run start:dev` to run TS code using ts-node</strong> <br>
   5.1: <strong>You can also run the bot with `npm run start` command</strong>

# License

<strong>This repository uses the [Apache License](https://github.com/bad-boy-discord/water-bot/blob/master/LICENSE)!</strong>

<a href="https://top.gg/bot/891819280318996501">
  <img src="https://top.gg/api/widget/891819280318996501.svg">
</a>
