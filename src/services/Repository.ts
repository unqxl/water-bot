import { DataSource, Repository } from "typeorm";
import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";
import config from "../config";

const data = new DataSource({
	name: "default",
	type: "mysql",
	host: config.mysql.host,
	port: 3306,
	username: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database,
	entities: [GuildConfiguration],
}).initialize();

export async function getRepository(): Promise<Repository<GuildConfiguration>> {
	const repository = (await data).getRepository(GuildConfiguration);
	return repository;
}
