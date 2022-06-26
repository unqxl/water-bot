import {
	ColorResolvable,
	EmbedAuthorData,
	Guild,
	GuildMember,
	resolveColor,
} from "discord.js";
import { request } from "undici";
import Bot from "./Bot";

export = class Functions {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
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

	sp(num: string | number) {
		return Number(num).toLocaleString("be");
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

interface Birthday {
	status: boolean;
	years?: number;
}
