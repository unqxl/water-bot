import { Webhook } from "@top-gg/sdk";
import { AutoPoster } from "topgg-autoposter";
import { BasePoster } from "topgg-autoposter/dist/structs/BasePoster";
import Bot from "../classes/Bot";

export = class TopGG {
	public client: Bot;
	public webhook: Webhook;
	public poster: BasePoster;

	constructor(client: Bot) {
		this.client = client;

		if (this.client.config.bot.test) return;
		if (!this.client.config.topgg.token)
			throw new Error("Cannot get Top-GG Authorization Token");
		if (!this.client.config.topgg.webhook_auth)
			throw new Error("Cannot get Top-GG Webhook Authorization Token");

		this.poster = AutoPoster(this.client.config.topgg.token, this.client);
		this.webhook = new Webhook(this.client.config.topgg.webhook_auth);

		this.poster.on("posted", () => {
			this.client.logger.log("Posted Bot Stats into Top-GG!", "Top-GG");
		});
	}
};
