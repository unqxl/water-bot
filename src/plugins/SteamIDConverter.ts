import bigInt from "big-integer";

export class SteamIDConverter {
	public BASE_NUM = bigInt("76561197960265728");
	public REGEX_STEAMID64 = /^[0-9]{17}$/;
	public REGEX_STEAMID = /^STEAM_[0-5]:[01]:\d+$/;
	public REGEX_STEAMID3 = /^\[U:1:[0-9]+\]$/;

	toSteamID64(steamid): boolean | string | Return {
		if (!steamid || typeof steamid !== "string") return false;
		else if (this.isSteamID3(steamid)) steamid = this.fromSteamID3(steamid);
		else if (!this.isSteamID(steamid)) {
			return { status: false, message: "Format: STEAM_X:Y:Z" };
		}

		var splitted = steamid.split(":");
		var v = this.BASE_NUM;
		var z = splitted[2];
		var y = splitted[1];

		if (z && y) {
			return v
				.plus(z * 2)
				.plus(y)
				.toString();
		}

		return false;
	}

	toSteamID(steamid): boolean | string | Return {
		if (!steamid || typeof steamid !== "string") return false;
		else if (this.isSteamID3(steamid)) steamid = this.fromSteamID3(steamid);
		else if (!this.isSteamID64(steamid)) {
			return { status: false, message: "Example: 76561190000000000" };
		}

		var v = this.BASE_NUM;
		var w = bigInt(steamid);
		var y = w.mod(2).toString();

		w = w.minus(y).minus(v);

		if (w.toJSNumber() < 1) return false;

		return `STEAM_0:${y}:${w.divide(2).toString()}`;
	}

	toSteamID3(steamid): boolean | string | Return {
		if (!steamid || typeof steamid !== "string") return false;
		else if (!this.isSteamID(steamid)) steamid = this.toSteamID(steamid);

		var split = steamid.split(":");

		return "[U:1:" + (parseInt(split[1]) + parseInt(split[2]) * 2) + "]";
	}

	fromSteamID3(steamid3) {
		var split = steamid3.split(":");
		var last = split[2].substring(0, split[2].length - 1);

		return "STEAM_0:" + (last % 2) + ":" + Math.floor(last / 2);
	}

	isSteamID(id) {
		if (!id || typeof id !== "string") return false;

		return this.REGEX_STEAMID.test(id);
	}

	isSteamID64(id) {
		if (!id || typeof id !== "string") return false;

		return this.REGEX_STEAMID64.test(id);
	}

	isSteamID3(id) {
		if (!id || typeof id !== "string") return false;

		return this.REGEX_STEAMID3.test(id);
	}

	profileURL(steamid64) {
		if (!this.isSteamID64(steamid64))
			steamid64 = this.toSteamID64(steamid64);

		return "http://steamcommunity.com/profiles/" + steamid64;
	}
}

export type Return = {
	status: boolean;
	message: string;
};
