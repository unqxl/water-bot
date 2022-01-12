import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { ValidateReturn, Categories } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class LeaveCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "leave",

			description: {
				en: "Leaving Guild with Specified ID!",
				ru: "Покидает Сервер с Указанным ID!",
			},

			category: Categories.BOTOWNER,
			usage: "<prefix>leave <id>",
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
			"BLURPLE",
			bold(text),
			"❌",
			true
		);
		const id = args[0];

		if (!isOwner) {
			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		if (!id) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"leave"
			);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
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

		const server = this.client.guilds.cache.get(id);
		if (!server) {
			const text = lang.ERRORS.GUILD_NOT_FOUND.replace("{id}", id);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
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
		const id = args[0];
		const server = this.client.guilds.cache.get(id);

		return await server
			.leave()
			.then(async () => {
				const text = lang.BOTOWNER.LEFT_GUILD.replace("{id}", id);
				const embed = this.client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(text),
					"✅",
					true
				);

				return message.channel.send({
					embeds: [embed],
				});
			})
			.catch((err) => {
				return message.channel.send({
					content: err,
				});
			});
	}
}
