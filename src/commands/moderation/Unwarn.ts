import {
	ButtonInteraction,
	ActionRowBuilder,
	ButtonBuilder,
	ComponentType,
} from "discord.js";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class UnwarnCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "unwarn",

			description: {
				en: "Deletes Last Warn from the Member!",
				ru: "Убирает Последнее Предупреждение с Участника!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>unwarn <member>",

			memberPermissions: ["ManageMessages"],
			botPermissions: ["ManageRoles"],
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		if (!member) {
			const text = lang.ERRORS.ARGS_MISSING("unwarn");
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

		// @ts-expect-error
		const lastWarns = await this.client.moderation.warns.all(member);
		if (!lastWarns.length) {
			const text = lang.ERRORS.NO_WARNS(member.toString());
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
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		const [accept, decline, confirmText] = [
			lang.FUNCTIONS.VERIFICATION.ACCEPT,
			lang.FUNCTIONS.VERIFICATION.DECLINE,
			lang.FUNCTIONS.VERIFICATION.TEXT,
		];

		const confirmButton = new ButtonBuilder()
			.setCustomId("confirm")
			.setStyle(3)
			.setLabel(accept)
			.setEmoji({ name: "✅" });

		const cancelButton = new ButtonBuilder()
			.setCustomId("cancel")
			.setStyle(4)
			.setLabel(decline)
			.setEmoji({ name: "❌" });

		const confirmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			confirmButton,
			cancelButton
		);

		const confirmEmbed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			confirmText,
			false,
			"✉️",
			true
		);

		const msg = await message.channel.send({
			embeds: [confirmEmbed],
			components: [confirmRow],
		});

		const collector = await msg.createMessageComponentCollector({
			filter: (btn) => btn.user.id === message.author.id,
			componentType: ComponentType.Button,
			max: 1,
			time: 20000,
		});

		collector.on("collect", async (btn: ButtonInteraction) => {
			if (btn.customId === "confirm") {
				// @ts-expect-error
				await this.client.moderation.unwarn(member);

				const text = lang.MODERATION.UNWARNED(member.toString());
				const embed = this.client.functions.buildEmbed(
					message,
					"Blurple",
					text,
					false,
					"✅",
					true
				);

				await msg.edit({
					embeds: [embed.toJSON()],
					components: [],
				});

				return;
			} else if (btn.customId === "cancel") {
				collector.stop();
				await msg.delete();

				return;
			}
		});

		collector.on("end", async (collected, reason) => {
			if (reason === "time") {
				await msg.delete();
			} else if (collected.first().customId === "cancel") {
				await msg.delete();
			}
		});
	}
}
