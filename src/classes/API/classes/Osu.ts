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

		auth.login(this.client_id, this.client_secret);
	}

	async getUserData(
		name: string | number,
		mode?: OsuModes
	): Promise<OsuUserData> {
		const userData = await this.api.user.get(name, mode ?? "osu");
		// @ts-expect-error
		return userData;
	}
};
