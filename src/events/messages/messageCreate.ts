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
				const { ok, error } = await command.validate(
					message,
					args,
					lang
				);
				if (ok && !error) return command.run(message, args, lang);

				return message.channel.send(error);
			}

			return command.run(message, args, lang);
		} else {
			try {
				const custom_commands = client.custom_commands.get(
					message.guild.id
				);
				if (!custom_commands.length) return;

				const custom_command = custom_commands.find(
					(x) => x.name === name
				);
				if (!custom_commands) return;

				return message.channel.send(custom_command.response);
			} catch (err) {
				return;
			}
		}
	}
}
