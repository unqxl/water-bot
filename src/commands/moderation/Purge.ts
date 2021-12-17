import {
	Categories,
	ValidateReturn,
} from "../../types/Command/BaseCommand";
import { Message, TextChannel } from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Goose from "../../classes/Goose";

export default class PurgeCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "purge",
			aliases: ["clear"],

			description: {
				en: "Deletes Messages from the Channel!",
				ru: "Удаляет Сообщения с Канала!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>purge <amount>",

			memberPermissions: ["MANAGE_MESSAGES"],
			botPermissions: ["MANAGE_MESSAGES"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const amount = args[0];

		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"purge"
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

		if (!Number(amount)) {
			const text = lang.ERRORS.IS_NAN.replace("{input}", amount);
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

		if (Number(amount) > 100) {
			const text = lang.ERRORS.CLEAR_LIMIT;
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
		const amount = Number(args[0]);

		return await (message.channel as TextChannel)
			.bulkDelete(amount, true)
			.then(async (collected) => {
				const text = lang.MODERATION.CLEARED.replace(
					"{amount}",
					collected.size.toLocaleString("be")
				);
				const embed = this.client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(text),
					"✅",
					true
				);

				const msg = await message.channel.send({
					embeds: [embed],
				});

				await this.client.wait(2000);
				await msg.delete();
			});
	}
}
