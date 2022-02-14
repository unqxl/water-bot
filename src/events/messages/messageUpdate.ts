import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import {
	TextChannel,
	Embed,
	ButtonComponent,
	ActionRow,
	Util,
} from "discord.js";
import { Message } from "discord.js";

export default class MessageUpdateEvent extends Event {
	constructor() {
		super("messageUpdate");
	}

	async run(client: Bot, old_message: Message, new_message: Message) {
		const settings = await client.database.getSettings(
			new_message.guild.id
		);
		if (!settings.log_channel) return;

		const log_channel = new_message.guild.channels.cache.get(
			settings.log_channel
		) as TextChannel;
		if (!log_channel) return;

		const lang_file = await client.functions.getLanguageFile(
			new_message.guild.id
		);

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		if (old_message === new_message) return;
		else if (old_message.content === new_message.content) return;
		else if (!old_message.embeds && new_message.embeds) return;

		const title = lang_file.EVENTS.MESSAGE_EVENTS.UPDATE.TITLE;
		const description = lang_file.EVENTS.MESSAGE_EVENTS.UPDATE.DESCRIPTION(
			new_message.author.toString(),
			old_message.content,
			new_message.content
		);

		const RedirectButton = new ButtonComponent()
			.setStyle(5)
			.setURL(new_message.url)
			.setLabel(lang_file.EVENTS.MESSAGE_EVENTS.UPDATE.GO_TO);

		const row = new ActionRow().addComponents(RedirectButton);
		const embed = new Embed()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: new_message.author.tag,
				iconURL: new_message.author.displayAvatarURL(),
			})
			.setTitle(title)
			.setDescription(description)
			.setFooter({
				text: happend_at,
			});

		return log_channel.send({
			embeds: [embed],
			components: [row],
		});
	}
}
