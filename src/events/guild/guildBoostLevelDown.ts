import { Guild, TextChannel, Embed, Util } from "discord.js";
import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";

export default class GuildBoostLevelDownEvent extends Event {
	constructor() {
		super("guildBoostLevelDown");
	}

	async run(client: Bot, guild: Guild, oldLevel: number, newLevel: number) {
		const settings = await client.database.getSettings(guild.id);
		if (!settings.log_channel) return;

		const log_channel = guild.channels.cache.get(
			settings.log_channel
		) as TextChannel;
		if (!log_channel) return;

		const lang_file = await client.functions.getLanguageFile(guild.id);
		const title = lang_file.EVENTS.GUILD_EVENTS.LEVEL_DOWN.TITLE;
		const description =
			lang_file.EVENTS.GUILD_EVENTS.LEVEL_DOWN.DESCRIPTION(newLevel);

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		const embed = new Embed()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL(),
			})
			.setTitle(title)
			.setDescription(description)
			.setFooter({
				text: happend_at,
			});

		return log_channel.send({
			embeds: [embed],
		});
	}
}
