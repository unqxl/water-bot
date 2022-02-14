import {
	ButtonInteraction,
	ActionRow,
	ButtonComponent,
	ComponentType,
} from "discord.js";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class WarnCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "warn",

			description: {
				en: "Gives Warn to the Member!",
				ru: "Выдаёт Предупреждение Участнику!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>warn <member>",

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
			const text = lang.ERRORS.ARGS_MISSING("warn");
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
					embeds: [embed],
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
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		var reason = args.slice(1).join(" ");
		if (!reason) reason = "-";

		const [accept, decline, confirmText] = [
			lang.FUNCTIONS.VERIFICATION.ACCEPT,
			lang.FUNCTIONS.VERIFICATION.DECLINE,
			lang.FUNCTIONS.VERIFICATION.TEXT,
		];

		const confirmButton = new ButtonComponent()
			.setCustomId("confirm")
			.setStyle(3)
			.setLabel(accept)
			.setEmoji({ name: "✅" });

		const cancelButton = new ButtonComponent()
			.setCustomId("cancel")
			.setStyle(4)
			.setLabel(decline)
			.setEmoji({ name: "❌" });

		const confirmRow = new ActionRow().addComponents(
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
				await this.client.moderation.warn(message, member, reason);

				const text = lang.MODERATION.WARNED(
					member.toString(),
					reason,
					message.author.toString()
				);
				const embed = this.client.functions.buildEmbed(
					message,
					"Blurple",
					text,
					false,
					"✅",
					true
				);

				await msg.edit({
					embeds: [embed],
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
