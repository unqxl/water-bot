import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import { Guild, EmbedBuilder, TextChannel, Util } from "discord.js";

export default class GuildPartnerRemoveEvent extends Event {
	constructor() {
		super("guildPartnerRemove");
	}

	async run(client: Bot, guild: Guild) {
		const settings = await client.database.getSettings(guild.id);
		if (!settings.log_channel) return;

		const log_channel = guild.channels.cache.get(
			settings.log_channel
		) as TextChannel;
		if (!log_channel) return;

		const lang_file = await client.functions.getLanguageFile(guild.id);
		const title = lang_file.EVENTS.GUILD_EVENTS.UNPARTNERED.TITLE;
		const description =
			lang_file.EVENTS.GUILD_EVENTS.UNPARTNERED.DESCRIPTION;

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		const embed = new EmbedBuilder()
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
			embeds: [embed.toJSON()],
		});
	}
}
