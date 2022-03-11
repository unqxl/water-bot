import Cluster from "discord-hybrid-sharding";
import config from "./config";
import chalk from "chalk";

const manager = new Cluster.Manager("./index.js", {
	totalShards: "auto",
	totalClusters: "auto",
	shardsPerClusters: 2,
	mode: "process",
	token: config.bot.test ? config.bot.testToken : config.bot.token,
});

manager.on("clusterCreate", (cluster) => {
	const tag = chalk.green("[Cluster Manager]");
	console.log(`${tag} Lauched Cluster #${cluster.id}`);
});

manager.spawn({
	timeout: -1,
});
