import { Message, TextChannel, Util } from "discord.js";
import { bold } from "@discordjs/builders";
import { RunFunction } from "../../interfaces/Event";
import random from "random";

export const name: string = "messageCreate";
export const run: RunFunction = async (client, message: Message) => {
	if (message.author.bot || !message.inGuild()) return;
	if (!message.guild.available) return;

	const lang = await client.functions.getLanguageFile(message.guild);
	const levelData = client.levels.getData(
		message.guild.id,
		message.author.id
	);
	levelData.xp += random.int(1, 10);

	client.levels.setData(message.guild.id, message.author.id, levelData);
	client.levels.handle(message);

	const prefix = client.database.getSetting(message.guild, "prefix");
	const mentionCheck = client.functions.checkBotMention(message);

	if (mentionCheck) {
		const text = lang.EVENTS.GUILD_PREFIX.replace(
			"{guild}",
			Util.escapeMarkdown(message.guild.name)
		).replace("{prefix}", prefix);
		const embed = client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			"💬",
			true
		);

		return message.channel.send({
			embeds: [embed],
		});
	}

	if (!message.content.startsWith(prefix)) return;

	const [cmd, ...args] = message.content
		.slice(prefix.length)
		.trim()
		.split(" ");
	if (!cmd) return;

	const command =
		client.commands.get(cmd) ||
		client.commands.get(client.aliases.get(cmd));
	if (!command) return;

	if (command.validate) {
		const { ok, error } = await command.validate(message, args, lang);

		if (!ok) {
			return message.channel.send(error);
		}
	}

	const channel = message.channel as TextChannel;

	if (command.options.memberPermissions) {
		if (
			!channel
				.permissionsFor(message.member)
				.has(command.options.memberPermissions)
		) {
			const perms = channel
				.permissionsFor(message.member)
				.missing(command.options.memberPermissions);

			if (perms.length > 0) {
				var missing = "";
				perms
					.map((perm) => (missing += lang.PERMISSIONS[perm]))
					.join(", ");

				const text = lang.ERRORS.MEMBER_MISSINGPERMS.replace(
					"{perms}",
					missing
				);
				const embed = client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(text),
					"❌",
					true
				);
				return message.channel.send({
					embeds: [embed],
				});
			}
		}
	}
	if (command.options.botPermissions) {
		if (
			!channel
				.permissionsFor(message.guild.me)
				.has(command.options.botPermissions)
		) {
			const perms = channel
				.permissionsFor(message.guild.me)
				.missing(command.options.botPermissions);

			if (perms.length > 0) {
				var missing = "";
				perms
					.map((perm) => (missing += lang.PERMISSIONS[perm]))
					.join(", ");

				const text = lang.ERRORS.BOT_MISSINGPERMS.replace(
					"{perms}",
					missing
				);
				const embed = client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(text),
					"❌",
					true
				);
				return message.channel.send({
					embeds: [embed],
				});
			}
		}
	}

	await command.run(message, args, lang);
};
