import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { TextChannel, ChannelType } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class DropGiveawayCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "giveaway-drop",

			description: {
				en: "Creates new Drop Giveaway in the Server!",
				ru: "Создаёт новый Drop Розыгрыш на сервере!",
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
					embeds: [embed.toJSON()],
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
		const channel =
			message.mentions.channels.first() ||
			message.guild.channels.cache.get(args[0]);

		const [write_winners, write_prize] = [
			lang.GIVEAWAYS.PROMPTS.CREATE_WINNERS,
			lang.GIVEAWAYS.PROMPTS.CREATE_PRIZE,
		];

		const [error_winners, error_prize] = [
			lang.GIVEAWAYS.ERRORS.ERROR_WINNERS,
			lang.GIVEAWAYS.ERRORS.ERROR_PRIZE,
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
					),
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
				embeds: [embed.toJSON()],
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
					),
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
				embeds: [embed.toJSON()],
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
				embeds: [embed.toJSON()],
			});
		}

		this.client.giveaways.start(channel as TextChannel, {
			isDrop: true,
			prize: prizePrompt as string,
			winnerCount: Number(winnersPrompt),
			messages: lang.GIVEAWAYS.MESSAGES,
		});
	}
}
