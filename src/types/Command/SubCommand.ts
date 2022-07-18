import { BaseSlashCommand, BaseSlashCommandOptions } from "./BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export interface SubCommandOptions extends BaseSlashCommandOptions {
	commandName: string;
	groupName?: string;
}

export abstract class SubCommand extends BaseSlashCommand<SubCommandOptions> {
	get options(): SubCommandOptions & {
		type: ApplicationCommandOptionType.Subcommand;
	} {
		return {
			type: ApplicationCommandOptionType.Subcommand,
			...this._options,
		};
	}
}
