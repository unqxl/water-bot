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
import { getRepository, Repository } from "typeorm";
import { GuildBan } from "../../typeorm/entities/GuildBan";
import Bot from "../../classes/Bot";

export default class BanCommand extends Command {
	constructor(
		client: Bot,
		private readonly banRepository: Repository<GuildBan> = getRepository(
			GuildBan
		)
	) {
		super(client, {
			name: "ban",

			description: {
				en: "Bans Member from the Guild!",
				ru: "Банит Участника Сервера!",
			},

			category: Categories.MODERATION,
			usage: "<prefix>ban <member> [reason]",

			memberPermissions: ["BAN_MEMBERS"],
			botPermissions: ["BAN_MEMBERS"],
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
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "ban");
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

		if (!member.bannable) {
			const text = lang.ERRORS.MEMBER_NOT_BANNABLE.replace(
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
				const text = lang.MODERATION.BANNED.replace(
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

				await member.ban({
					days: 7,
					reason: reason,
				});

				await msg.edit({
					embeds: [embed],
					components: [],
				});

				const ban = this.banRepository.create({
					guild_id: message.guild.id,
					banned_member_id: member.id,
					issued_by: message.author.id,
					reason: reason,
					creation_date: new Date(),
				});
				await this.banRepository.save(ban);

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
