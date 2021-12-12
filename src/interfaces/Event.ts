import Goose from "../classes/Goose";
import { EventEmitter } from "events";

export interface RunFunction {
  (
    client: Goose,
    ...param: unknown[]
  ): Promise<unknown>;
}

export interface Event {
  name: string;
  run: RunFunction;
  emitter?: EventEmitter;
}
