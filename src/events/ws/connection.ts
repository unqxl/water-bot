import Bot from "../../classes/Bot";
import Event from "../../types/Event/Event";
import client from "../../index";

export default class WebSocketConnectionEvent extends Event {
	constructor() {
		super("connection", client.socket);
	}

	async run(client: Bot) {
		return client.logger.log("WebSocket successfully connected!", "WS");
	}
}
