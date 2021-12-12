import { Message, MessageOptions, PermissionString } from "discord.js";
import Goose from "../../classes/Goose";

export enum Categories {
  BOTOWNER = 0,
  ECONOMY = 1,
  FUN = 2,
  GAMES = 3,
  MODERATION = 4,
  MUSIC = 5,
  OTHER = 6,
  SETTINGS = 7,
  LEVELING = 8,
}

export interface BaseCommandOptions {
  name: string;
  category: Categories;
  aliases?: string[];
  description?: Description;
  usage?: string;
  memberPermissions?: PermissionString[];
  botPermissions?: PermissionString[];
}

interface Description {
  ru: string;
  en: string;
}

export type ValidateReturn = {
  ok: boolean;
  error?: MessageOptions;
};

export abstract class BaseCommand<
  TOptions extends BaseCommandOptions = BaseCommandOptions
> {
  protected _options: TOptions;
  client: Goose;
  name: string;

  constructor(client: Goose, options: TOptions) {
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
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<ValidateReturn>;
  abstract run(
    message: Message,
    args: string[],
    lang: typeof import('@locales/English').default
  ): Promise<unknown>;
}
