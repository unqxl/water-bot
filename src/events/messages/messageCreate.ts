import { Message } from "discord.js";
import Bot from "classes/Bot";
import Event from "../../types/Event/Event";

export default class MessageCreateEvent extends Event {
	constructor() {
		super("messageCreate");
	}

	async run(client: Bot, message: Message) {
		if (!message.inGuild() || !message.guild.available) return;
		if (message.author && message.author.bot) return;

		const config = client.configs.get(message.guild.id);
		const lang = await client.functions.getLanguageFile(message.guild.id);

		if (!message.content.startsWith(config.prefix)) return;
		const [name, ...args] = message.content
			.slice(config.prefix.length)
			.trim()
			.split(" ");

		const command =
			client.commands.get(name) ||
			client.commands.get(client.aliases.get(name));

		if (command) {
			if (command.validate) {
				return await command.validate(message, args, lang);
			}

			return command.run(message, args, lang);
		}
	}
}
