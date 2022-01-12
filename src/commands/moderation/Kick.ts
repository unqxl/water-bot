import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import {
	ButtonInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";
import { Command } from "../../types/Command/Command";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

export default class KickCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "kick",

			description: {
				en: "Kicks Member from the Guild!",
				ru: "Выгоняет Участника с Сервера!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>kick <member> [reason]",

			memberPermissions: ["KICK_MEMBERS"],
			botPermissions: ["KICK_MEMBERS"],
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
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "kick");
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

		if (!member.kickable) {
			const text = lang.ERRORS.MEMBER_NOT_KICKABLE.replace(
				"{target}",
				member.toString()
			);
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
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

		const confirmButton = new MessageButton()
			.setCustomId("confirm")
			.setStyle("SUCCESS")
			.setLabel(accept)
			.setEmoji("✅");

		const cancelButton = new MessageButton()
			.setCustomId("cancel")
			.setStyle("DANGER")
			.setLabel(decline)
			.setEmoji("❌");

		const confirmRow = new MessageActionRow().addComponents([
			confirmButton,
			cancelButton,
		]);

		const confirmEmbed = new MessageEmbed()
			.setColor("BLURPLE")
			.setAuthor({
				name: message.author.username,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
			})
			.setDescription(bold(confirmText))
			.setTimestamp();

		const msg = await message.channel.send({
			embeds: [confirmEmbed],
			components: [confirmRow],
		});

		const collector = await msg.createMessageComponentCollector({
			filter: (btn) => btn.user.id === message.author.id,
			componentType: "BUTTON",
			max: 1,
			time: 20000,
		});

		collector.on("collect", async (btn: ButtonInteraction) => {
			if (btn.customId === "confirm") {
				const text = lang.MODERATION.KICKED.replace(
					"{target}",
					member.toString()
				)
					.replace("{reason}", reason)
					.replace("{moderator}", message.author.toString());

				const embed = this.client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(text),
					"✅",
					true
				);

				await member.kick(reason);

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
