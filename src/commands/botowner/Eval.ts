import { Message, MessageButton, MessageActionRow } from "discord.js";
import {
	ValidateReturn,
	Categories,
} from "../../structures/Command/BaseCommand";
import { Command } from "../../structures/Command/Command";
import { get } from "sourcebin";
import { bold } from "@discordjs/builders";
import { transpile } from "typescript";
import { inspect } from "util";
import { Type } from "@anishshobith/deeptype";
import Goose from "../../classes/Goose";

const classified = [
	"this.client.token",
	"this.client.config.token",
	"client.token",
	"client.config.token",
	"process.env",
	'client["token"]',
	"client['token']",
];

export default class EvalCommand extends Command {
	constructor(client: Goose) {
		super(client, {
			name: "eval",
			category: Categories.BOTOWNER,

			description: {
				en: "Executes Code from SourceBin or Message Content!",
				ru: "Выполняет Код из SourceBin или Контента Сообщения!",
			},

			usage: "<prefix>eval <code>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const isOwner = this.client.functions.checkOwner(message.author);
		const text = lang.ERRORS.NO_ACCESS;

		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			"❌",
			true
		);
		const code = args[0];

		if (!isOwner) {
			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		if (!code) {
			const text = lang.ERRORS.ARGS_MISSING.replace("{cmd_name}", "eval");

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
		const bin_code = args[0];
		var wasCanceled = false;

		var bin;

		try {
			bin = await get(`https://sourceb.in/${bin_code}`, {
				fetchContent: true,
			});

			bin = bin.files[0].content;
		} catch (error) {
			bin = args.join(" ");
		}

		if (bin.includes("import")) bin = transpile(bin);
		if (bin.includes("await")) bin = `(async() => {\n${bin}\n})()`;

		classified.forEach((itm) => {
			if (bin.toLowerCase().includes(itm)) {
				wasCanceled = true;
			}
		});

		if (wasCanceled) {
			const error = lang.ERRORS.EVAL_CANCELED;
			const embed = this.client.functions.buildEmbed(
				message,
				"RED",
				`**${error}**`,
				"❌",
				true
			);

			return message.channel.send({
				embeds: [embed],
			});
		}

		let evaled;
		const startTime = process.hrtime();

		evaled = eval(bin);
		if (evaled instanceof Promise) {
			evaled = await evaled;
		}

		const stopTime = process.hrtime(startTime);
		const res = [
			`**Output:** \`\`\`js\n${this.clean(
				inspect(evaled, { depth: 0 })
			)}\n\`\`\``,
			`**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
			`**Time Taken:** \`\`\`${
				(stopTime[0] * 1e9 + stopTime[1]) / 1e6
			}ms\`\`\``,
		].join("\n");

		const deleteBTN = new MessageButton()
			.setCustomId("delete")
			.setStyle("PRIMARY")
			.setEmoji("❌");

		const row = new MessageActionRow().addComponents([deleteBTN]);

		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			res,
			false,
			true
		);

		const msg = await message.channel.send({
			embeds: [embed],
			components: [row],
		});

		const collector = await msg.createMessageComponentCollector({
			filter: (btn) =>
				btn.user.id === message.author.id && btn.customId === "delete",
			max: 1,
			componentType: "BUTTON",
			time: 60000 * 60,
		});

		collector.on("collect", async (btn) => {
			if (btn.customId === "delete") {
				await msg.delete();
				collector.stop();

				return;
			}
		});
	}

	clean(text) {
		if (typeof text === "string") {
			text = text
				.replace(/`/g, `\`${String.fromCharCode(8203)}`)
				.replace(/@/g, `@${String.fromCharCode(8203)}`)
				.replace(
					new RegExp(this.client.token, "gi"),
					"mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0"
				);
		}

		return text;
	}
}
