import { Guild, TextChannel } from "discord.js";
import { request } from "undici";
import twitchLive from "../events/twitchLive";
import Bot from "../classes/Bot";

interface TwitchData {
	name: string;
	picture: string;
	title: string;
	thumbnail: string;
	date: number;
}

export = class TwitchSystem {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	async send(channel: TextChannel, data: TwitchData) {
		const lang = await this.client.functions.getLanguageFile(
			channel.guild.id
		);

		return await twitchLive(this.client, lang, channel, data);
	}

	async check(guild: Guild) {
		const { twitchSystem, twitchStreamers } =
			await this.client.configurations.get(guild.id);

		const twitchChannel = await this.client.database.getSetting(
			guild.id,
			"twitch_channel"
		);

		if (!twitchSystem) return;
		if (!twitchChannel) return;

		const channel = guild.channels.cache.get(twitchChannel) as TextChannel;

		if (!channel) return;
		if (!twitchStreamers.length) return;

		for (let i = 0; i < twitchStreamers.length; i++) {
			const URL = `https://api.twitch.tv/helix/streams?first=1&user_login=${twitchStreamers[i].name}`;
			const streamerURL = `https://api.twitch.tv/helix/users?login=${twitchStreamers[i].name}`;

			const twitchData = await (
				await request(URL, {
					headers: {
						Authorization: `Bearer ${this.client.twitchKey}`,
						"Client-ID": this.client.config.twitch.client_id,
					},
					method: "GET",
				})
			).body.json();

			const streamerData = await (
				await request(streamerURL, {
					headers: {
						Authorization: `Bearer ${this.client.twitchKey}`,
						"Client-ID": this.client.config.twitch.client_id,
					},
					method: "GET",
				})
			).body.json();

			if (!twitchData || !streamerData) continue;
			if (!twitchData.data?.length) continue;

			const TwitchAPI = twitchData.data[0];
			const StreamerData = streamerData.data[0];

			if (twitchStreamers[i].latestStream === TwitchAPI.id) continue;

			const data: TwitchData = {
				name: TwitchAPI.user_name,
				title: TwitchAPI.title,
				picture: StreamerData.profile_image_url,
				thumbnail: TwitchAPI.thumbnail_url
					.replace("{width}", "1280")
					.replace("{height}", "720"),
				date: TwitchAPI.started_at,
			};

			await this.sync(guild, data.name, TwitchAPI.id);
			await this.send(channel, data);
			return;
		}
	}

	async sync(guild: Guild, username: string, latestStream: string) {
		const { twitchStreamers } = await this.client.configurations.get(
			guild.id
		);

		var streamer = twitchStreamers.find((x) => x.name === username);
		streamer.latestStream = latestStream;

		return this.client.database.setConfigProp(
			guild.id,
			"twitchStreamers",
			twitchStreamers
		);
	}
};
