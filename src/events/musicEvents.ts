import { EmbedBuilder, hyperlink } from "discord.js";
import Bot from "../classes/Bot";
import { LanguageService } from "../services/Language";

export = (client: Bot) => {
	return client.music
		.on("playSong", async (queue, song) => {
			const lang = new LanguageService(client, queue.textChannel.guildId);
			const [starting, title, url, views, duration, requestedBy] = [
				await lang.get("EVENTS:PLAY_SONG:START"),
				await lang.get("EVENTS:PLAY_SONG:TITLE"),
				await lang.get("EVENTS:PLAY_SONG:URL"),
				await lang.get("EVENTS:PLAY_SONG:VIEWS"),
				await lang.get("EVENTS:PLAY_SONG:DURATION"),
				await lang.get("EVENTS:PLAY_SONG:REQUESTEDBY"),
			];

			const embed = new EmbedBuilder();
			embed.setColor("Blurple");
			embed.setAuthor({
				name: song.user.tag,
				iconURL: song.user.avatarURL(),
			});
			embed.setDescription(
				[
					`🎶 | **${starting}**`,
					"",
					`› **${title}**: **${song.name}**`,
					`› **${url}**: **${hyperlink("Click", song.url)}**`,
					`› **${views}**: **${song.views.toLocaleString("be")}**`,
					`› **${duration}**: **[0:00/${song.formattedDuration}]**`,
					`› **${requestedBy}**: **${song.user.toString()}**`,
				].join("\n")
			);
			embed.setTimestamp();

			return queue.textChannel.send({ embeds: [embed] });
		})
		.on("addSong", async (queue, song) => {
			const lang = new LanguageService(client, queue.textChannel.guildId);
			const [prepare, title, url, views, duration, requestedBy] = [
				await lang.get("EVENTS:ADD_SONG:PREPARE"),
				await lang.get("EVENTS:ADD_SONG:TITLE"),
				await lang.get("EVENTS:ADD_SONG:URL"),
				await lang.get("EVENTS:ADD_SONG:VIEWS"),
				await lang.get("EVENTS:ADD_SONG:DURATION"),
				await lang.get("EVENTS:ADD_SONG:REQUESTEDBY"),
			];

			const embed = new EmbedBuilder();
			embed.setColor("Blurple");
			embed.setAuthor({
				name: song.user.tag,
				iconURL: song.user.avatarURL(),
			});
			embed.setDescription(
				[
					`🎶 | **${prepare}**`,
					"",
					`› **${title}**: **${song.name}**`,
					`› **${url}**: **${hyperlink("Click", song.url)}**`,
					`› **${views}**: **${song.views.toLocaleString("be")}**`,
					`› **${duration}**: **[0:00/${song.formattedDuration}]**`,
					`› **${requestedBy}**: **${song.user.toString()}**`,
				].join("\n")
			);
			embed.setTimestamp();

			return queue.textChannel.send({ embeds: [embed] });
		})
		.on("error", (channel, error) => {
			const embed = new EmbedBuilder();
			embed.setColor("Red");
			embed.setDescription(`❌ | **${error.message}**`);
			embed.setTimestamp();

			return channel.send({ embeds: [embed] });
		});
};
