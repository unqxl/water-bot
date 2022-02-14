import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class ReloadCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "reload",

			description: {
				en: "Command that reloads other Bot Commands.",
				ru: "Команда, которая перезагружает другие команды.",
			},

			category: Categories.BOTOWNER,
			usage: "<prefix>reload <category> <name>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const isOwner = this.client.functions.checkOwner(message.author);
		const text = lang.ERRORS.NO_ACCESS;
		const embed = this.client.functions.buildEmbed(
			message,
			"Red",
			text,
			false,
			"❌",
			true
		);

		const category = args[0];
		const name = args[1];

		if (!isOwner) {
			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		if (!category) {
			const text = lang.ERRORS.ARGS_MISSING("reload");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		if (!name) {
			const text = lang.ERRORS.ARGS_MISSING("reload");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const category = args[0];
		const name = args[1];

		const cmd = this.client.commands.get(name);
		if (!cmd) {
			const text = lang.ERRORS.NOT_FOUND("command list");
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		try {
			delete require.cache[require.resolve(`../${category}/${name}`)];
			this.client.commands.delete(name);

			const command = new (require(`../${category}/${name}`).default)(
				this.client
			) as Command;

			this.client.commands.set(command.name, command);

			if (command.options?.aliases) {
				command.options.aliases.forEach((alias) =>
					this.client.aliases.set(alias, command.name)
				);
			}

			const text = lang.BOTOWNER.COMMAND_RELOADED(name);
			const embed = this.client.functions.buildEmbed(
				message,
				"Blurple",
				text,
				false,
				"✅",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		} catch (error) {
			console.warn(error);

			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				error.message,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}
	}
}
