import configExample from "../../cfg.example";
import IMDBAPI from "./classes/IMDB";
import OsuAPI from "./classes/osu";
import SteamAPI from "./classes/Steam";

export = class API {
	public config: typeof configExample;
	public steam: SteamAPI;
	public osu: OsuAPI;
	public imdb: IMDBAPI;

	constructor(config: typeof configExample) {
		this.config = config;

		this.steam = new SteamAPI(this.config.keys.steam_key);
		this.osu = new OsuAPI(
			this.config.keys.osu_client_id,
			this.config.keys.osu_client_secret
		);
		this.imdb = new IMDBAPI(this.config.keys.imdb_key);
	}
};
