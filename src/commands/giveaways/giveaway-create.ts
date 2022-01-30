import { Message, TextChannel } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";
import ms from "ms";

export default class CreateGiveawayCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "giveaway-create",

			description: {
				en: "Creates new Giveaway in the Server!",
				ru: "Создаёт новый Розыгрыш на сервере!",
			},

			category: Categories.GIVEAWAYS,
			usage: "<prefix>giveaway-create <channel>",

			memberPermissions: ["MANAGE_GUILD"],
		});
	}

	async validate(
		message: Message<boolean>,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const channel =
			message.mentions.channels.first() ||
			message.guild.channels.cache.get(args[0]);

		if (!channel) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"giveaway-create"
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

		if (!["GUILD_TEXT", "GUILD_NEWS"].includes(channel.type)) {
			const text = lang.ERRORS.CHANNEL_TYPE;
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
		const channel =
			message.mentions.channels.first() ||
			message.guild.channels.cache.get(args[0]);

		const [write_winners, write_prize, write_time] = [
			lang.GIVEAWAYS.PROMPTS.CREATE_WINNERS,
			lang.GIVEAWAYS.PROMPTS.CREATE_PRIZE,
			lang.GIVEAWAYS.PROMPTS.CREATE_TIME,
		];

		const [error_winners, error_prize, error_time] = [
			lang.GIVEAWAYS.ERRORS.ERROR_WINNERS,
			lang.GIVEAWAYS.ERRORS.ERROR_PRIZE,
			lang.GIVEAWAYS.ERRORS.ERROR_TIME,
		];

		const prizePrompt = await this.client.functions.promptMessage(
			message,
			{
				embeds: [
					this.client.functions.buildEmbed(
						message,
						"BLURPLE",
						bold(write_prize),
						"✉️",
						true
					),
				],
			},
			20000
		);

		if (!prizePrompt) {
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(error_prize),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const winnersPrompt = await this.client.functions.promptMessage(
			message,
			{
				embeds: [
					this.client.functions.buildEmbed(
						message,
						"BLURPLE",
						bold(write_winners),
						"✉️",
						true
					),
				],
			},
			10000
		);

		if (!winnersPrompt) {
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(error_winners),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		if (!Number(winnersPrompt)) {
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(
					lang.ERRORS.IS_NAN.replace(
						"{input}",
						winnersPrompt as string
					)
				),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		const timePrompt = await this.client.functions.promptMessage(
			message,
			{
				embeds: [
					this.client.functions.buildEmbed(
						message,
						"BLURPLE",
						bold(write_time),
						"✉️",
						true
					),
				],
			},
			20000
		);

		if (!timePrompt) {
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(error_time),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		this.client.giveaways.start(channel as TextChannel, {
			duration: ms(timePrompt as string),
			prize: prizePrompt as string,
			winnerCount: Number(winnersPrompt),
			messages: lang.GIVEAWAYS.MESSAGES,
		});
	}
}
