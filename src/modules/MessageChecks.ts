import { Message } from "discord.js";
import { request } from "undici";

interface IAntiFish {
	match: boolean;
	matches: {
		followed: false;
		domain: string;
		source: string;
		type: "IP_LOGGER" | "PHISHING";
		trust_rating: number;
	}[];
}

export = class MessageChecks {
	ghostPing(message: Message): boolean {
		if (message.mentions.roles.size || message.mentions.members.size) {
			return true;
		}

		return false;
	}

	async antiFish(
		message: Message
	): Promise<boolean | { type: string; domain: string }> {
		let content = "";

		if (message.content.startsWith("https://")) {
			content = message.content.slice("https://".length);
		} else if (message.content.startsWith("http://")) {
			content = message.content.slice("http://".length);
		} else {
			content = message.content;
		}

		const data: IAntiFish = await (
			await request("https://anti-fish.bitflow.dev/check", {
				method: "POST",
				body: JSON.stringify({
					message: content,
				}),
				headers: {
					"Content-Type": "application/json",
					"User-Agent": "Water-Bot (discord.com)",
				},
			})
		).body.json();

		if (!data.match) return false;
		else {
			return {
				type: data.matches[0].type,
				domain: data.matches[0].domain,
			};
		}
	}
};
