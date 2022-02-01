import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import GhostPing from "../../modules/GhostPing";
import { Message, TextChannel, MessageEmbed } from "discord.js";

export default class MessageDeleteEvent extends Event {
	constructor() {
		super("messageDelete");
	}

	async run(client: Bot, message: Message) {
		const settings = await client.database.getSettings(message.guild.id);
		if (!settings.log_channel) return;

		const log_channel = message.guild.channels.cache.get(
			settings.log_channel
		) as TextChannel;
		if (!log_channel) return;

		const lang_file = await client.functions.getLanguageFile(
			message.guild.id
		);

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		const checker = new GhostPing();
		if (checker.handle(message)) {
			const title =
				lang_file.EVENTS.MESSAGE_EVENTS.DELETE.GHOST_PING.TITLE;

			const description =
				lang_file.EVENTS.MESSAGE_EVENTS.DELETE.GHOST_PING.DESCRIPTION(
					message.author.toString(),
					message.content
				);

			const embed = new MessageEmbed()
				.setColor("YELLOW")
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
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

		const title = lang_file.EVENTS.MESSAGE_EVENTS.DELETE.TITLE;
		const description = lang_file.EVENTS.MESSAGE_EVENTS.DELETE.DESCRIPTION(
			message.author.toString(),
			message.content
		);

		const embed = new MessageEmbed()
			.setColor("BLURPLE")
			.setAuthor({
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
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
