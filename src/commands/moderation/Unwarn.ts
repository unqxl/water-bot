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

			memberPermissions: ["MANAGE_MESSAGES"],
			botPermissions: ["MANAGE_ROLES"],
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
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"unwarn"
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

		const lastWarns = await this.client.moderation.warns.all(member);
		if (!lastWarns.length) {
			const text = lang.ERRORS.NO_WARNS.replace(
				"{member}",
				member.toString()
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
			time: 20000,
		});

		collector.on("collect", async (btn: ButtonInteraction) => {
			if (btn.customId === "confirm") {
				await this.client.moderation.unwarn(member);

				const text = lang.MODERATION.UNWARNED.replace(
					"{target}",
					member.toString()
				);
				const embed = this.client.functions.buildEmbed(
					message,
					"BLURPLE",
					bold(text),
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
