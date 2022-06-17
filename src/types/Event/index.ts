import { EventEmitter } from "node:events";
import client from "../../index";
import Bot from "../../classes/Bot";

export default abstract class Event {
	public client: Bot = client;

	constructor(private name: string, private emitter?: any) {}

	getName(): string {
		return this.name;
	}

	getEmitter(): EventEmitter {
		return this.emitter;
	}

	abstract run(client: Bot, ...args: any): void;
}
