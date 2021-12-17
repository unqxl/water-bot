import { UserLeveling } from "../../interfaces/Guild";

export class LevelingUser {
	_data: UserLeveling;

	constructor(data: UserLeveling) {
		this._data = data;
	}

	get data() {
		return this._data;
	}

	setXP(amount: number) {
		this.data.xp = amount;

		return this.data;
	}

	setLevel(amount: number) {
		this.data.level = amount;

		return this.data;
	}

	addXP(amount: number) {
		this.data.xp += amount;

		return this.data;
	}

	addLevel(amount: number) {
		this.data.level += amount;

		return this.data;
	}

	subtractXP(amount: number) {
		this.data.xp -= amount;

		return this.data;
	}

	subtractLevel(amount: number) {
		this.data.level -= amount;

		return this.data;
	}
}
