import {
	ApplicationCommandOption,
	ApplicationCommandOptionData,
	ChatInputCommandInteraction,
	InteractionReplyOptions,
	LocalizationMap,
	PermissionsString,
} from "discord.js";
import { LanguageService } from "../../services/Language";
import Bot from "../../classes/Bot";

export interface BaseSlashCommandOptions {
	name: string;
	description: string;
	descriptionLocalizations?: LocalizationMap;

	options?: (ApplicationCommandOption | ApplicationCommandOptionData)[];

	memberPermissions?: PermissionsString[];
	botPermissions?: PermissionsString[];

	experimentMode?: ExperimentMode;
}

interface ExperimentMode {
	status: boolean;
	id: number;
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
		lang: LanguageService
	): Promise<ValidateReturn>;

	abstract run(
		interaction: ChatInputCommandInteraction<"cached" | "raw">,
		lang: LanguageService
	): Promise<unknown>;
}
