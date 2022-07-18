import { ExperimentOptions } from "../types/types";
import Experiments from "../assets/experiments.json";
import Enmap from "enmap";
import client from "../index";

export = class Experiment {
	public database: Enmap<string, ExperimentOptions[]>;

	constructor() {
		this.database = client.experiments;
	}

	/**
	 * Gets all the experiments of a guild.
	 */
	getAll(id: string): ExperimentOptions[] {
		return this.database.get(id);
	}

	/**
	 * Gets an experiment of a guild.
	 */
	get(guild: string, id: number): ExperimentOptions {
		const experiments = this.database.get(guild);

		const experiment = experiments.find((e) => e.id === id);
		if (!experiment) return null;

		return experiment;
	}

	/**
	 * Checks for experiment in a guild.
	 */
	check(guild: string, id: number): boolean {
		const experiments = this.database.get(guild);

		const experiment = experiments.find((e) => e.id === id);
		return !!experiment;
	}

	/**
	 * Adds an experiment to a guild.
	 */
	grant(guild: string, id: number): boolean {
		const experiments = this.database.get(guild);

		const experiment = experiments.find((e) => e.id === id);
		if (experiment) return false;

		const data = Experiments.find((x) => x.id === id);
		experiments.push({
			id: id,
			name: data.name,
			description: data.description,
		});

		this.database.set(guild, experiments);
		return true;
	}

	/**
	 * Removes an experiment from a guild.
	 */
	revoke(guild: string, id: number): boolean {
		const experiments = this.database.get(guild);

		const experiment = experiments.find((e) => e.id === id);
		if (!experiment) return false;

		experiments.splice(experiments.indexOf(experiment), 1);
		this.database.set(guild, experiments);

		return true;
	}
};
