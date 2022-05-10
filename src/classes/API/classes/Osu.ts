import { v2, auth } from "osu-api-extended";
import { OsuUserData } from "../types";

type OsuModes = "osu" | "fruits" | "mania" | "taiko";

export = class OsuAPI {
	public client_id: number;
	public client_secret: string;
	public api: typeof v2;

	constructor(client_id: number, client_secret: string) {
		this.client_id = client_id;
		this.client_secret = client_secret;
		this.api = v2;
	}

	async getUserData(
		name: string | number,
		mode?: OsuModes
	): Promise<OsuUserData> {
		await auth.login(this.client_id, this.client_secret);

		const userData = await this.api.user.details(
			name,
			mode ?? "osu",
			"username"
		);

		// @ts-expect-error ignore
		return userData;
	}

	async getBeatmapList(name: string, mode: OsuModes) {
		await auth.login(this.client_id, this.client_secret);

		const data = await this.api.beatmap.search({
			query: name,
			mode: mode,
			nfsw: false,
		});

		return data.beatmapsets;
	}
};
