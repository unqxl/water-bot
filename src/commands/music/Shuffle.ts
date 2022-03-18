import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class ShuffleCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "shuffle",

			description: {
				en: "Shuffles Server Music Queue!",
				ru: "Перемешивает Музыкальную Очередь Сервера!",
			},

			category: Categories.MUSIC,
			usage: "<prefix>shuffle",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const { djRoles } = this.client.configurations.get(message.guild.id);
		if (djRoles.length) {
			const { status, message: error } = await this.client.DJSystem.check(
				message
			);
			if (!status) {
				const embed = this.client.functions.buildEmbed(
					message,
					"Red",
					error,
					false,
					"❌",
					true
				);

				return {
					ok: false,
					error: {
						embeds: [embed.toJSON()],
					},
				};
			}
		}

		const [error, voice_error] = await Promise.all([
			lang.ERRORS.NOT_JOINED_VOICE,
			lang.ERRORS.JOIN_BOT_VOICE,
		]);

		if (!message.member.voice.channel) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				error,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.toJSON()],
				},
			};
		}

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel &&
			message.member.voice.channel !== message.guild.me.voice.channel
		) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				voice_error,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.toJSON()],
				},
			};
		}

		const queue = this.client.music.getQueue(message);
		if (!queue) {
			const text = lang.ERRORS.QUEUE_EMPTY;
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
					embeds: [embed.toJSON()],
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
		const queue = this.client.music.getQueue(message);
		queue.shuffle();

		const text = lang.MUSIC.SHUFFLED;
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.toJSON()],
		});
	}
}
