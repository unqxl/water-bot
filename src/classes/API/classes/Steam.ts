import { BestMatch, SteamAppDetail, SteamAppList } from "../types";
import { findBestMatch } from "string-similarity";
import { request } from "undici";

export = class SteamAPI {
	public key: string;
	public APP_LIST_URL =
		"https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json";

	constructor(key: string) {
		this.key = key;
	}

	getAppURL(id: string | number, l: string) {
		return `https://store.steampowered.com/api/appdetails?appids=${id}&l=${l}&cc=${l}`;
	}

	getStoreAppLink(id: string | number) {
		return `https://store.steampowered.com/app/${id}`;
	}

	async getAppList(): Promise<SteamAppList> {
		const data = await (await request(this.APP_LIST_URL)).body.json();
		return data as SteamAppList;
	}

	async getBestMatch(target: string): Promise<BestMatch> {
		const apps = await (await this.getAppList()).applist.apps
			.filter((c) => c.name !== "")
			.map((c) => c.name);

		const bestMatch = findBestMatch(target, apps).bestMatch;
		return bestMatch;
	}

	async getAppInfo(name: string, l: string): Promise<SteamAppDetail> {
		const app_name = await (await this.getBestMatch(name)).target;
		const app_id = await (
			await this.getAppList()
		).applist.apps.find((x) => x.name === app_name).appid;
		const app_url = this.getAppURL(app_id, l);

		const app_info: SteamAppDetail = await (
			await request(app_url)
		).body.json();

		return app_info[`${app_id}`];
	}
};
