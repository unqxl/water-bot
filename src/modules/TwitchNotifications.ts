import { GuildService } from "../services/Guild";
import { request } from "undici";
import twitchStreamerLive from "../events/twitchStreamerLive";
import Bot from "../classes/Bot";

export = class TwitchNotifications {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	async handle(id: string) {
		const guild = this.client.guilds.cache.get(id);
		if (!guild) return;

		const service = new GuildService(this.client);
		const settings = await service.getSettings(id);

		if (
			!settings.twitch_system ||
			!settings.twitch_channel ||
			!settings.streamers.length
		) {
			return;
		}

		const streamers = settings.streamers;
		for (const streamer of streamers) {
			const token = this.client.twitchKey;
			const client_id = this.client.config.twitch.client_id;

			const stream_data = await (
				await request(
					`https://api.twitch.tv/helix/streams?first=1&user_login=${streamer.name}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Client-ID": client_id,
						},
					}
				)
			).body.json();

			const streamer_data = await (
				await request(
					`https://api.twitch.tv/helix/users?login=${streamer.name}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Client-ID": client_id,
						},
					}
				)
			).body.json();

			if (!stream_data || !streamer_data) continue;
			if (stream_data.data.length === 0) continue;

			const stream = stream_data.data[0];
			const [
				stream_id,
				_streamer,
				stream_title,
				profile_url,
				thumbnail_url,
				viewers,
				started_at,
			] = [
				stream.id,
				stream.user_name,
				stream.title,
				streamer_data.data[0].profile_image_url,
				stream.thumbnail_url
					.replace("{width}", "1280")
					.replace("{height}", "720"),
				stream.viewer_count,
				stream.started_at,
			];

			if (streamer.last_stream === stream_id) continue;

			streamer.last_stream = stream_id;
			service.set(id, "streamers", streamers);

			twitchStreamerLive(this.client, {
				guild_id: guild.id,
				stream_id,
				streamer: _streamer,
				stream_title,
				profile_url,
				thumbnail_url,
				viewers: Number(viewers),
				started_at: new Date(started_at).getTime(),
			});
		}
	}
};
