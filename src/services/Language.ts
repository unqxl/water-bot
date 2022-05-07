import { LocaleTemplate } from "./locales/index";
import { GuildService } from "./Guild";
import Bot from "../classes/Bot";

type TwoDotPrefix<T extends string> = T extends "" ? "" : `:${T}`;
// prettier-ignore
type SearchFormat<T> = (
	T extends object
		? {
			[K in Exclude<keyof T, symbol>]: `${K}${TwoDotPrefix<SearchFormat<T[K]>>}`;
		  }[Exclude<keyof T, symbol>]
		: ""
) extends infer D
	? Extract<D, string>
	: never;

export class LanguageService {
	public client: Bot;
	public service: GuildService;
	public guild_id: string;

	constructor(client: Bot, guild_id: string) {
		this.client = client;
		this.guild_id = guild_id;
		this.service = new GuildService(this.client);
	}

	async get(
		key: SearchFormat<LocaleTemplate>,
		...args: string[]
	): Promise<null | string> {
		const [category, sub, prop] = key.split(":");
		const locale = await this.service.getSetting(this.guild_id, "locale");

		const LocaleFile = (await import(`./locales/${locale}`).then(
			(module) => module.default
		)) as LocaleTemplate;

		var value: string;
		if (typeof prop === "string") {
			value = LocaleFile[category][sub][prop];
		} else {
			value = LocaleFile[category][sub];
		}

		if (value === undefined) return null;

		const regex = /%s/g;
		const toChange = value.match(regex);
		if (!toChange.length) return value;

		for (let i = 0; i < toChange.length; i++) {
			value = value.replace(toChange[i], args[i]);
		}

		return value;
	}

	async all(): Promise<LocaleTemplate> {
		const locale = await this.service.getSetting(this.guild_id, "locale");

		const LocaleFile = (await import(`./locales/${locale}`).then(
			(module) => module.default
		)) as LocaleTemplate;

		return LocaleFile;
	}
}
