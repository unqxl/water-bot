import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class StopGiveawayCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "giveaway-stop",

			description: {
				en: "Force-Stops Giveaway in the Server!",
				ru: "Досрочно останавливает розыгрыш на сервере!",
			},

			category: Categories.GIVEAWAYS,
			usage: "<prefix>giveaway-stop <message_id>",

			memberPermissions: ["MANAGE_GUILD"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const message_id = args[0];
		if (!message_id) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"giveaway-stop"
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

		const giveaway = this.client.giveaways.giveaways.find(
			(g) => g.messageId === message_id && g.guildId === message.guild.id
		);

		if (!giveaway) {
			const text = lang.ERRORS.GIVEAWAY_NOT_FOUND(message_id);
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
		const message_id = args[0];
		const giveaway = this.client.giveaways.giveaways.find(
			(g) => g.messageId === message_id && g.guildId === message.guild.id
		);

		return giveaway.end().then(() => {
			const text = lang.GIVEAWAYS.RESPONSES.ENDED(message_id);
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		});
	}
}
