import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { TextChannel, ChannelType } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
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

			memberPermissions: ["ManageGuild"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const channel =
			message.mentions.channels.first() ||
			message.guild.channels.cache.get(args[0]);

		if (!channel) {
			const text = lang.ERRORS.ARGS_MISSING("giveaway-create");
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
					embeds: [embed.embed.toJSON()],
				},
			};
		}

		if (
			![ChannelType.GuildText, ChannelType.GuildNews].includes(
				channel.type
			)
		) {
			const text = lang.ERRORS.CHANNEL_TYPE;
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
					embeds: [embed.embed.toJSON()],
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
						"Blurple",
						write_prize,
						false,
						"✉️",
						true
					).json,
				],
			},
			20000
		);

		if (!prizePrompt) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				error_prize,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.embed.toJSON()],
			});
		}

		const winnersPrompt = await this.client.functions.promptMessage(
			message,
			{
				embeds: [
					this.client.functions.buildEmbed(
						message,
						"Blurple",
						write_winners,
						false,
						"✉️",
						true
					).json,
				],
			},
			10000
		);

		if (!winnersPrompt) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				error_winners,
				false,
				"✉️",
				true
			);

			return message.channel.send({
				embeds: [embed.embed.toJSON()],
			});
		}

		if (!Number(winnersPrompt)) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				lang.ERRORS.IS_NAN(winnersPrompt as string),
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.embed.toJSON()],
			});
		}

		const timePrompt = await this.client.functions.promptMessage(
			message,
			{
				embeds: [
					this.client.functions.buildEmbed(
						message,
						"Blurple",
						write_time,
						false,
						"✉️",
						true
					).json,
				],
			},
			20000
		);

		if (!timePrompt) {
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				error_time,
				false,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed.embed.toJSON()],
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
