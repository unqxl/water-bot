import { EmbedBuilder, Message, TextChannel, Util } from "discord.js";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";
import MessageChecks from "../../modules/MessageChecks";

export default class MessageCreateEvent extends Event {
	constructor() {
		super("messageCreate");
	}

	async run(client: Bot, message: Message) {
		if (!message.inGuild() || !message.guild.available) return;

		const config = client.configs.get(message.guild.id);
		const lang = await client.functions.getLanguageFile(message.guild.id);

		//! Phishing Check - Start !//
		const checker = new MessageChecks();
		const phishingCheck = await checker.antiFish(message);
		if (typeof phishingCheck === "object") {
			if (message.deletable) message.delete();
			if (!config.log_channel) return;

			const logChannel = message.guild.channels.cache.get(
				config.log_channel
			) as TextChannel;

			const type =
				lang.EVENTS.MESSAGE_EVENTS.CREATE.ANTI_FISH.TYPES[
					phishingCheck.type
				];

			const title = lang.EVENTS.MESSAGE_EVENTS.CREATE.ANTI_FISH.TITLE;
			const text =
				lang.EVENTS.MESSAGE_EVENTS.CREATE.ANTI_FISH.DESCRIPTION(
					type,
					message.author.toString(),
					phishingCheck.domain
				);

			const embed = new EmbedBuilder()
				.setColor(Util.resolveColor("Red"))
				.setTitle(title)
				.setDescription(bold(text))
				.setTimestamp();

			return logChannel.send({
				embeds: [embed.toJSON()],
			});
		}

		//! Phishing Check - End !//

		if (message.author && message.author.bot) return;
		if (client.functions.checkBotMention(message)) {
			const embed = client.functions.buildEmbed(
				message,
				"Blurple",
				lang.EVENTS.GUILD_PREFIX(message.guild.name, config.prefix),
				false,
				"✉️",
				true
			);

			return message.channel.send({
				embeds: [embed.data.toJSON()],
			});
		}

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

			return command.run(message as Message, args, lang);
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
