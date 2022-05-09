import Bot from "../classes/Bot";
import { EventEmitter } from "events";

export interface RunFunction {
	(client: Bot, ...param: unknown[]): Promise<unknown>;
}

export interface Event {
	name: string;
	run: RunFunction;
	emitter?: EventEmitter;
}
