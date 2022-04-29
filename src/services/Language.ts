import { LocaleTemplate } from "./locales/index";
import { GuildService } from "./Guild";

type TwoDotPrefix<T extends string> = T extends "" ? "" : `:${T}`;
type SearchFormat<T> = (
	T extends object
		? {
				[K in Exclude<keyof T, symbol>]: `${K}${TwoDotPrefix<
					SearchFormat<T[K]>
				>}`;
		  }[Exclude<keyof T, symbol>]
		: ""
) extends infer D
	? Extract<D, string>
	: never;

export class LanguageService {
	public GuildService: GuildService;
	public guild_id: string;

	constructor(guild_id: string) {
		this.guild_id = guild_id;
		this.GuildService = new GuildService();
	}

	async get(
		key: SearchFormat<LocaleTemplate>,
		...args: string[]
	): Promise<null | string> {
		const [category, prop] = key.split(":");
		const locale = await this.GuildService.getSetting(
			this.guild_id,
			"locale"
		);

		const LocaleFile = (await import(`./locales/${locale}`).then(
			(module) => module.default
		)) as LocaleTemplate;

		var value = LocaleFile[category][prop] as string;
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
		const locale = await this.GuildService.getSetting(
			this.guild_id,
			"locale"
		);

		const LocaleFile = (await import(`./locales/${locale}`).then(
			(module) => module.default
		)) as LocaleTemplate;

		return LocaleFile;
	}
}
