import { GiveawaysManager } from "discord-giveaways";
import { createConnection } from "mysql";
import Bot from "./Bot";
import config from "../config";

const sql = createConnection({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database,
	port: 3306,
	charset: "utf8mb4",
});

sql.connect((err) => {
	if (err) console.log(err);
});

sql.query(
	`
	CREATE TABLE IF NOT EXISTS \`giveaways\`
	(
		\`id\` INT(1) NOT NULL AUTO_INCREMENT,
		\`message_id\` VARCHAR(20) NOT NULL,
		\`data\` JSON NOT NULL,
		PRIMARY KEY (\`id\`)
	);
`,
	(err, res) => {
		if (err) console.log(err);
	}
);

export class SQLGiveaways extends GiveawaysManager {
	public declare client: Bot;

	async getAllGiveaways() {
		return new Promise((res, rej) => {
			sql.query("SELECT `data` from `giveaways`", (err, resp) => {
				if (err) return rej(err);

				const giveaways = resp.map((row) =>
					JSON.parse(row.data, (_, v) =>
						typeof v === "string" && /BigInt\("(-?\d+)"\)/.test(v)
							? eval(v)
							: v
					)
				);

				return res(giveaways);
			});
		});
	}

	async saveGiveaway(messageId, giveawayData) {
		return new Promise((res, rej) => {
			sql.query(
				"INSERT INTO `giveaways` (`message_id`, `data`) VALUES (?,?)",
				[
					messageId,
					JSON.stringify(giveawayData, (_, v) =>
						typeof v === "bigint" ? `BigInt("${v}")` : v
					),
				],
				(err, resp) => {
					if (err) return rej(err);

					return res(true);
				}
			);
		});
	}

	async editGiveaway(messageId, giveawayData) {
		return new Promise((res, rej) => {
			sql.query(
				"UPDATE `giveaways` `data` = ? WHERE `message_id` = ?",
				[
					JSON.stringify(giveawayData, (_, v) =>
						typeof v === "bigint" ? `BigInt("${v}")` : v
					),
					messageId,
				],
				(err, resp) => {
					if (err) return rej(err);

					return res(true);
				}
			);
		});
	}

	async deleteGiveaway(messageId): Promise<boolean> {
		return new Promise((res, rej) => {
			sql.query(
				"DELETE FROM `giveaways` WHERE `message_id` = ?",
				messageId,
				(err, resp) => {
					if (err) return rej(err);

					return res(true);
				}
			);

			return res(true);
		});
	}
}
