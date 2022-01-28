import { GiveawaysManager } from "discord-giveaways";
import Bot from "./Bot";

export class EnmapGiveaways extends GiveawaysManager {
	public declare client: Bot;

	async getAllGiveaways() {
		return this.client.giveawaysDB.fetchEverything().array();
	}

	async saveGiveaway(messageId, giveawayData) {
		this.client.giveawaysDB.set(messageId, giveawayData);

		return true;
	}

	async editGiveaway(messageId, giveawayData) {
		this.client.giveawaysDB.set(messageId, giveawayData);

		return true;
	}

	async deleteGiveaway(messageId) {
		this.client.giveawaysDB.delete(messageId);

		return true;
	}
}
