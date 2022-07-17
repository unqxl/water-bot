import configExample from "../../cfg.example";
import IMDBAPI from "./classes/IMDB";
import OsuAPI from "./classes/osu";
import SteamAPI from "./classes/Steam";

export = class API {
	public config: typeof configExample;

	public steam: SteamAPI;
	public imdb: IMDBAPI;
	public osu: OsuAPI;

	constructor(config: typeof configExample) {
		this.config = config;

		if (this.config.keys.imdb_key !== null) {
			this.imdb = new IMDBAPI(this.config.keys.imdb_key);
		}

		if (this.config.keys.steam_key !== null) {
			this.steam = new SteamAPI(this.config.keys.steam_key);
		}

		if (
			this.config.keys.osu_client_id !== null &&
			this.config.keys.osu_client_secret !== null
		) {
			this.osu = new OsuAPI(
				this.config.keys.osu_client_id,
				this.config.keys.osu_client_secret
			);
		}
	}
};
