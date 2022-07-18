import { IMDBFilmData, IMDBSearchData, IMDBSearchResult } from "../types";
import { request } from "undici";

export = class IMDBAPI {
	public key: string;
	public search_link: string;
	public info_link: string;

	constructor(key: string) {
		this.key = key;
	}

	generateSearchLink(name: string, l: string) {
		const link = `https://imdb-api.com/${l}/API/Search/${this.key}/${name}`;
		return link;
	}

	generateInfoLink(id: string, l: string) {
		const link = `https://imdb-api.com/${l}/API/Title/${this.key}/${id}`;
		return link;
	}

	async getFirstResult(name: string, l: string): Promise<IMDBSearchResult> {
		const link = this.generateSearchLink(name, l);

		const data: IMDBSearchData = await (await request(link)).body.json();
		if (!data.results.length) return null;

		return data.results[0];
	}

	async getData(name: string, l: string): Promise<IMDBFilmData> {
		const { id } = await this.getFirstResult(name, l);
		const link = this.generateInfoLink(id, l);
		
		const data: IMDBFilmData = await (await request(link)).body.json();
		return data;
	}
};
