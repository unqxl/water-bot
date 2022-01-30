import { bold, hyperlink } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import Bot from "../classes/Bot";

export = async (client: Bot) => {
	return client.music
		.on("addSong", async (queue, song) => {
			const lang = await client.functions.getLanguageFile(
				queue.textChannel.guild.id
			);

			const [
				embed_title,
				title,
				url,
				views,
				duration,
				songs,
				requestedBy,
			] = [
				lang.EVENTS.MUSIC_EVENTS.ADD_SONG.EMBED_TITLE,
				lang.EVENTS.MUSIC_EVENTS.ADD_SONG.TITLE,
				lang.EVENTS.MUSIC_EVENTS.ADD_SONG.URL,
				lang.EVENTS.MUSIC_EVENTS.ADD_SONG.VIEWS,
				lang.EVENTS.MUSIC_EVENTS.ADD_SONG.DURATION,
				lang.EVENTS.MUSIC_EVENTS.ADD_SONG.SONGS,
				lang.EVENTS.MUSIC_EVENTS.ADD_SONG.REQUESTED_BY,
			];

			const hyperLink = hyperlink("Click", song.url);
			var text: string = "";
			text += `› ${bold(title)}: ${bold(song.name)}\n`;
			text += `› ${bold(url)}: ${bold(hyperLink)}\n`;
			text += `› ${bold(views)}: ${bold(
				client.functions.sp(song.views)
			)}\n`;
			text += `› ${bold(duration)}: ${bold(song.formattedDuration)}\n`;
			text += `› ${bold(requestedBy)}: ${bold(song.user.toString())}\n`;
			text += `› ${bold(songs)}: ${bold(
				client.functions.sp(queue.songs.length)
			)}\n`;

			const embed = new MessageEmbed()
				.setColor("BLURPLE")
				.setAuthor({
					name: song.user.username,
					iconURL: song.user.displayAvatarURL({ dynamic: true }),
				})
				.setTitle(embed_title)
				.setDescription(text)
				.setTimestamp();

			queue.textChannel.send({
				embeds: [embed],
			});

			return;
		})
		.on("playSong", async (queue, song) => {
			const lang = await client.functions.getLanguageFile(
				queue.textChannel.guild.id
			);

			const [
				embed_title,
				title,
				url,
				views,
				duration,
				songs,
				requestedBy,
			] = [
				lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.EMBED_TITLE,
				lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.TITLE,
				lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.URL,
				lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.VIEWS,
				lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.DURATION,
				lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.SONGS,
				lang.EVENTS.MUSIC_EVENTS.PLAY_SONG.REQUESTED_BY,
			];

			const hyperLink = hyperlink("Click", song.url);
			var text: string = "";
			text += `› ${bold(title)}: ${bold(song.name)}\n`;
			text += `› ${bold(url)}: ${bold(hyperLink)}\n`;
			text += `› ${bold(views)}: ${bold(
				client.functions.sp(song.views)
			)}\n`;
			text += `› ${bold(duration)}: ${bold(song.formattedDuration)}\n`;
			text += `› ${bold(requestedBy)}: ${bold(song.user.toString())}\n`;
			text += `› ${bold(songs)}: ${bold(
				client.functions.sp(queue.songs.length)
			)}\n`;

			const embed = new MessageEmbed()
				.setColor("BLURPLE")
				.setAuthor({
					name: song.user.username,
					iconURL: song.user.displayAvatarURL({ dynamic: true }),
				})
				.setTitle(embed_title)
				.setDescription(text)
				.setTimestamp();

			queue.textChannel.send({
				embeds: [embed],
			});

			return;
		})
		.on("addList", async (queue, playlist) => {
			const lang = await client.functions.getLanguageFile(
				queue.textChannel.guild.id
			);

			const [
				embed_title,
				title,
				url,
				views,
				duration,
				playlistSongs,
				songs,
				requestedBy,
			] = [
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.EMBED_TITLE,
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.TITLE,
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.URL,
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.VIEWS,
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.DURATION,
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.PLAYLIST_SONGS,
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.SONGS,
				lang.EVENTS.MUSIC_EVENTS.ADD_LIST.REQUESTED_BY,
			];

			const hyperLink = hyperlink("Click", playlist.url);

			var text: string = "";
			text += `› ${bold(title)}: ${bold(playlist.name)}\n`;
			text += `› ${bold(url)}: ${bold(hyperLink)}\n`;
			text += `› ${bold(views)}: ${bold(
				client.functions.sp(playlist.views)
			)}\n`;
			text += `› ${bold(duration)}: ${bold(
				playlist.formattedDuration
			)}\n`;
			text += `› ${bold(playlistSongs)}: ${bold(
				client.functions.sp(playlist.songs.length)
			)}\n`;
			text += `› ${bold(songs)}: ${bold(
				client.functions.sp(queue.songs.length)
			)}\n`;
			text += `› ${bold(requestedBy)}: ${bold(
				playlist.user.toString()
			)}\n`;

			const embed = new MessageEmbed()
				.setColor("BLURPLE")
				.setTitle(embed_title)
				.setDescription(text)
				.setTimestamp();

			queue.textChannel.send({
				embeds: [embed],
			});

			return;
		})
		.on("finish", async (queue) => {
			const lang = await client.functions.getLanguageFile(
				queue.textChannel.guild.id
			);

			const text = lang.EVENTS.MUSIC_EVENTS.FINISH;
			const embed = new MessageEmbed()
				.setColor("BLURPLE")
				.setDescription(bold(text))
				.setTimestamp();

			queue.textChannel.send({
				embeds: [embed],
			});

			return;
		})
		.on("error", async (channel, error) => {
			const lang = await client.functions.getLanguageFile(
				channel.guild.id
			);

			const text = lang.EVENTS.MUSIC_EVENTS.ERROR(error.message);
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription(bold(text))
				.setTimestamp();

			channel.send({
				embeds: [embed],
			});

			return;
		})
		.on("empty", async (queue) => {
			const lang = await client.functions.getLanguageFile(
				queue.textChannel.guild.id
			);

			const text = lang.EVENTS.MUSIC_EVENTS.EMPTY;
			const embed = new MessageEmbed()
				.setColor("RED")
				.setDescription(bold(text))
				.setTimestamp();

			queue.textChannel.send({
				embeds: [embed],
			});

			return;
		});
};
