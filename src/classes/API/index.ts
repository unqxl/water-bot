import configExample from "../../config.example";
import SteamAPI from "./classes/Steam";

export = class API {
	public config: typeof configExample;
	public steam: SteamAPI;

	constructor(config: typeof configExample) {
		this.config = config;
		this.steam = new SteamAPI(this.config.keys.steam_key);
	}
};
