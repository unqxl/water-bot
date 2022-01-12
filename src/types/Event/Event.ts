import { EventEmitter } from "node:events";
import Bot from "../../classes/Bot";

export default abstract class Event {
	constructor(private name: string, private emitter?: any) {}

	getName(): string {
		return this.name;
	}

	getEmitter(): EventEmitter {
		return this.emitter;
	}

	abstract run(client: Bot, ...args: any): void;
}
