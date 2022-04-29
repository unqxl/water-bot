import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { TextChannel } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class PurgeCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "purge",
			aliases: ["clear"],

			description: {
				en: "Deletes Messages from the Channel!",
				ru: "Удаляет Сообщения с Канала!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>purge <amount>",

			memberPermissions: ["ManageMessages"],
			botPermissions: ["ManageMessages"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const amount = args[0];

		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING("purge");
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
					embeds: [embed.data.toJSON()],
				},
			};
		}

		if (!Number(amount)) {
			const text = lang.ERRORS.IS_NAN(amount);
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
					embeds: [embed.data.toJSON()],
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
		let amount = Number(args[0]);
		if (amount > 100) amount = 100;

		return await (message.channel as TextChannel)
			.bulkDelete(amount, true)
			.then(async (collected) => {
				const text = lang.MODERATION.CLEARED(
					collected.size.toLocaleString("be")
				);
				const embed = this.client.functions.buildEmbed(
					message,
					"Blurple",
					text,
					false,
					"✅",
					true
				);

				const msg = await message.channel.send({
					embeds: [embed.data.toJSON()],
				});

				await this.client.wait(2000);
				await msg.delete();
			});
	}
}
