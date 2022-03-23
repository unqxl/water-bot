import {
	ApplicationCommandOption,
	ApplicationCommandOptionData,
	ChatInputCommandInteraction,
	InteractionReplyOptions,
	PermissionsString,
} from "discord.js";
import Bot from "../../classes/Bot";

export interface BaseSlashCommandOptions {
	name: string;
	description: string;
	memberPermissions?: PermissionsString[];
	botPermissions?: PermissionsString[];
	options?: (ApplicationCommandOption | ApplicationCommandOptionData)[];
}

export type ValidateReturn = {
	ok: boolean;
	error?: InteractionReplyOptions;
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
		interaction: ChatInputCommandInteraction<"cached" | "raw">,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn>;

	abstract run(
		interaction: ChatInputCommandInteraction<"cached" | "raw">,
		lang: typeof import("@locales/English").default
	): Promise<unknown>;
}
