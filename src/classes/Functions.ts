import {
	ColorResolvable,
	Guild,
	EmbedBuilder,
	User,
	GuildMember,
	EmbedAuthorData,
	resolveColor,
} from "discord.js";
import { APIEmbed } from "discord-api-types/v9";
import { Message } from "discord.js";
import { request } from "undici";
import { bold } from "@discordjs/builders";
import Bot from "./Bot";

export = class Functions {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	buildEmbed(
		message: Message | { author: User | null },
		color: ColorResolvable,
		text: string,
		footer: string | boolean,
		emoji: string | boolean,
		showAuthor: boolean,
		showTimestamp?: boolean
	): {
		data: EmbedBuilder;
		json: APIEmbed;
	} {
		const embed = new EmbedBuilder();

		if (showAuthor === true) {
			embed.setAuthor({
				name: message.author.username,
				iconURL: message.author.displayAvatarURL(),
			});
		}

		if (showTimestamp === true) embed.setTimestamp();

		embed.setColor(resolveColor(color));
		embed.setDescription(
			typeof emoji === "string" ? `${emoji} | ${bold(text)}` : bold(text)
		);
		embed.setFooter(typeof footer === "string" ? { text: footer } : null);

		return {
			data: embed,
			json: embed.toJSON(),
		};
	}

	checkOwner(target: User): boolean {
		return this.client.owners.includes(target.id);
	}

	async updateToken(): Promise<boolean> {
		const id = this.client.config.twitch.client_id;
		const secret = this.client.config.twitch.client_secret;

		const data = await (
			await request(
				`https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`,
				{
					method: "POST",
				}
			)
		).body.json();

		this.client.twitchKey = data["access_token"];

		return true;
	}

	formatNumber(n: number | string) {
		return Number.parseFloat(String(n)).toLocaleString("be-BE");
	}

	checkGuildBirthday(guild: Guild): Birthday {
		const createDate = guild.createdTimestamp;
		const date = new Date(createDate);
		const toYear = new Date(createDate);
		const currentDate = new Date();

		date.setFullYear(new Date().getFullYear() + 1);

		if (date.getTime() !== currentDate.getTime()) {
			return {
				status: false,
			};
		} else {
			const createdYear = toYear.getFullYear();
			const yearNow = currentDate.getFullYear();
			const diff = Math.floor(yearNow - createdYear);

			return {
				status: true,
				years: diff,
			};
		}
	}

	sp(num: string | number) {
		return Number(num).toLocaleString("be");
	}

	declOfNum(n: number, text_forms: string[]) {
		n = Math.abs(n) % 100;
		const n1 = n % 10;

		if (n > 10 && n < 20) {
			return text_forms[2];
		}

		if (n1 > 1 && n1 < 5) {
			return text_forms[1];
		}

		if (n1 == 1) {
			return text_forms[0];
		}

		return text_forms[2];
	}

	author(member: GuildMember): EmbedAuthorData {
		return {
			name: member.displayName,
			iconURL: member.displayAvatarURL(),
		};
	}

	color(color: ColorResolvable): number {
		return resolveColor(color);
	}

	voiceCheck(
		me: GuildMember,
		member: GuildMember
	): { status: boolean; code?: 1 | 2 } {
		if (!member.voice.channel) {
			return {
				status: false,
				code: 1,
			};
		}

		if (
			me.voice.channel &&
			member.voice.channel.id !== me.voice.channel.id
		) {
			return {
				status: false,
				code: 2,
			};
		}

		return {
			status: true,
		};
	}
};

type WarningTypes = "warning" | "error";

interface Birthday {
	status: boolean;
	years?: number;
}
