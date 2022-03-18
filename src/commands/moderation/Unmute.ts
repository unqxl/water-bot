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

export default class UnmuteCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "unmute",

			description: {
				en: "Deletes Mute from the Member!",
				ru: "Убирает Оглушение с Участника!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>unmute <member>",

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
			const text = lang.ERRORS.ARGS_MISSING("unmute");
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

		const muteRole = await this.client.database.getSetting(
			message.guild.id,
			"mute_role"
		);
		if (muteRole === "0") {
			const text = lang.ERRORS.NO_MUTEROLE;
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
		const lastMute = await this.client.moderation.mutes.getMute(member);
		if (!lastMute) {
			const text = lang.ERRORS.NO_MUTE(member.toString());
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
				await this.client.moderation.unmute(member);

				const text = lang.MODERATION.UNMUTED(member.toString());
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
