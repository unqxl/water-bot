import {
	ApplicationCommandOptionData,
	ApplicationCommandType,
	CommandInteraction,
	MessageOptions,
} from "discord.js";
import Bot from "../../classes/Bot";

export interface BaseSlashCommandOptions {
	name: string;
	description: string;
	type?: ApplicationCommandType;
	options?: ApplicationCommandOptionData[];
	defaultPermission?: false;
}

export type ValidateReturn = {
	ok: boolean;
	error?: MessageOptions;
};

export abstract class BaseSlashCommand<
	TOptions extends BaseSlashCommandOptions = BaseSlashCommandOptions
> {
	protected _options: TOptions;
	client: Bot;
	name: string;

	constructor(client: Bot, options: TOptions) {
		this.client = client;
		this.name = options.name;
		this._options = options;

		this.validate = this.validate?.bind(this);
		this.run = this.run?.bind(this);
	}

	get options(): TOptions {
		return this._options;
	}

	validate?(
		interaction: CommandInteraction,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn>;

	abstract run(
		interaction: CommandInteraction,
		lang: typeof import("@locales/English").default
	): Promise<unknown>;
}
