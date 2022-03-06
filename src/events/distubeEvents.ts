import { bold, hyperlink } from "@discordjs/builders";
import { Embed, Util } from "discord.js";
import Bot from "../classes/Bot";

export = async (client: Bot) => {
	const get_language = async (id: string) => {
		return await client.functions.getLanguageFile(id);
	};

	const sp = (val: string | number) => client.functions.sp(val);

	return client.music
		.on(
			"addSong",
			async (
				{ textChannel: channel, songs: queue_songs },
				{ name, url: song_url, formattedDuration, user }
			) => {
				const lang = await get_language(channel.guild.id);
				const [embed_title, title, url, duration, songs, requestedBy] =
					[
						lang.EVENTS.MUSIC_EVENTS.ADD_SONG.EMBED_TITLE,
						lang.EVENTS.MUSIC_EVENTS.ADD_SONG.TITLE,
						lang.EVENTS.MUSIC_EVENTS.ADD_SONG.URL,
						lang.EVENTS.MUSIC_EVENTS.ADD_SONG.DURATION,
						lang.EVENTS.MUSIC_EVENTS.ADD_SONG.SONGS,
						lang.EVENTS.MUSIC_EVENTS.ADD_SONG.REQUESTED_BY,
					];

				var text = [
					`› ${bold(title)}: ${bold(name)}`,
					`› ${bold(url)}: ${bold(hyperlink("Click", song_url))}`,
					`› ${bold(duration)}: ${bold(formattedDuration)}`,
					`› ${bold(requestedBy)}: ${bold(user.toString())}`,
					`› ${bold(songs)}: ${bold(sp(queue_songs.length))}`,
				].join("\n");

				const embed = new Embed()
					.setColor(Util.resolveColor("Blurple"))
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL(),
					})
					.setTitle(embed_title)
					.setDescription(text)
					.setTimestamp();

				channel.send({
					embeds: [embed],
				});

				return;
			}
		)
		.on(
			"playSong",
			async (
				{ textChannel: channel, songs: queue_songs },
				{ name, url: song_url, formattedDuration, user }
			) => {
				const lang = await get_language(channel.guild.id);

				const [embed_title, title, url, duration, songs, requestedBy] =
					[
						lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.EMBED_TITLE,
						lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.TITLE,
						lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.URL,
						lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.DURATION,
						lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.SONGS,
						lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.REQUESTED_BY,
					];

				var text = [
					`› ${bold(title)}: ${bold(name)}`,
					`› ${bold(url)}: ${bold(hyperlink("Click", song_url))}`,
					`› ${bold(duration)}: ${bold(formattedDuration)}`,
					`› ${bold(requestedBy)}: ${bold(user.toString())}`,
					`› ${bold(songs)}: ${bold(sp(queue_songs.length))}`,
				].join("\n");

				const embed = new Embed()
					.setColor(Util.resolveColor("Blurple"))
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL(),
					})
					.setTitle(embed_title)
					.setDescription(text)
					.setTimestamp();

				channel.send({
					embeds: [embed],
				});

				return;
			}
		)
		.on(
			"addList",
			async (
				{ textChannel: channel, songs: queue_songs },
				{ name, url: pl_link, formattedDuration, songs: pl_songs, user }
			) => {
				const lang = await get_language(channel.guild.id);

				const [
					embed_title,
					title,
					url,
					duration,
					playlistSongs,
					songs,
					requestedBy,
				] = [
					lang.EVENTS.MUSIC_EVENTS.ADD_LIST.EMBED_TITLE,
					lang.EVENTS.MUSIC_EVENTS.ADD_LIST.TITLE,
					lang.EVENTS.MUSIC_EVENTS.ADD_LIST.URL,
					lang.EVENTS.MUSIC_EVENTS.ADD_LIST.DURATION,
					lang.EVENTS.MUSIC_EVENTS.ADD_LIST.PLAYLIST_SONGS,
					lang.EVENTS.MUSIC_EVENTS.ADD_LIST.SONGS,
					lang.EVENTS.MUSIC_EVENTS.ADD_LIST.REQUESTED_BY,
				];

				var text = [
					`› ${bold(title)}: ${bold(name)}`,
					`› ${bold(url)}: ${bold(hyperlink("Click", pl_link))}`,
					`› ${bold(duration)}: ${bold(formattedDuration)}`,
					`› ${bold(playlistSongs)}: ${bold(sp(pl_songs.length))}`,
					`› ${bold(songs)}: ${bold(sp(queue_songs.length))}`,
					`› ${bold(requestedBy)}: ${bold(user.toString())}`,
				].join("\n");

				const embed = new Embed()
					.setColor(Util.resolveColor("Blurple"))
					.setTitle(embed_title)
					.setDescription(text)
					.setTimestamp();

				channel.send({
					embeds: [embed],
				});

				return;
			}
		)
		.on("finish", async ({ textChannel: channel }) => {
			const lang = await get_language(channel.guild.id);
			const text = lang.EVENTS.MUSIC_EVENTS.FINISH;
			const embed = new Embed()
				.setColor(Util.resolveColor("Blurple"))
				.setDescription(bold(text))
				.setTimestamp();

			channel.send({
				embeds: [embed],
			});

			return;
		})
		.on("error", async (channel, error) => {
			const lang = await get_language(channel.guild.id);
			const text = lang.EVENTS.MUSIC_EVENTS.ERROR(error.message);
			const embed = new Embed()
				.setColor(Util.resolveColor("Red"))
				.setDescription(bold(text))
				.setTimestamp();

			channel.send({
				embeds: [embed],
			});

			return;
		})
		.on("empty", async ({ textChannel: channel }) => {
			const lang = await get_language(channel.guild.id);
			const text = lang.EVENTS.MUSIC_EVENTS.EMPTY;
			const embed = new Embed()
				.setColor(Util.resolveColor("Red"))
				.setDescription(bold(text))
				.setTimestamp();

			channel.send({
				embeds: [embed],
			});

			return;
		});
};
