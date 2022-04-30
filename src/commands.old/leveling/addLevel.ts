import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { Command } from "../../types/Command/Command";
import { Message } from "discord.js";
import Bot from "../../classes/Bot";

export default class AddLevelCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "addlevel",

			description: {
				en: "Adds Level to Someone!",
				ru: "Добавляет Уровень Участнику!",
			},

			category: Categories.LEVELING,
			usage: "<prefix>addlevel <user> <amount>",
			memberPermissions: ["Administrator"],
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
			const text = lang.ERRORS.ARGS_MISSING("addlevel");
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

		const amount = args[1];
		if (!amount) {
			const text = lang.ERRORS.ARGS_MISSING("addlevel");
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
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		const amount = Number(args[1]);
		await this.client.levels.addLevel(message.guild.id, member.id, amount);

		const text = lang.LEVELING.ADDED_LEVEL(
			this.client.functions.sp(amount),
			member.toString()
		);
		const embed = this.client.functions.buildEmbed(
			message,
			"Blurple",
			text,
			false,
			"✅",
			true
		);

		return message.channel.send({
			embeds: [embed.data.toJSON()],
		});
	}
}