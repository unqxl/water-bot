import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import Bot from "../../classes/Bot";

export default class ClustersCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "clusters",
			category: Categories.BOTOWNER,

			description: {
				en: "-",
				ru: "-",
			},

			usage: "<prefix>clusters",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		if (!this.client.owners.includes(message.author.id)) {
			const text = lang.ERRORS.NO_ACCESS;
			const embed = this.client.functions.buildEmbed(
				message,
				"Red",
				text,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.toJSON()],
				},
			};
		}
		return {
			ok: true,
		};
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		await this.client.guilds.fetch();

		return this.client.cluster
			.broadcastEval((c) => [
				c["cluster"].id,
				c.ws.ping,
				c.guilds.cache.size,
			])
			.then((res) => {
				const filedData = res.map((data) => {
					console.log(data);
					return {
						name: `📡 Cluster ${data[0]}:`,
						value: [
							`› **Ping**: **${data[1]}ms**`,
							`› **Guilds**: **${data[2]}**`,
						].join("\n"),
						inline: true,
					};
				});

				const embed = this.client.functions.buildEmbed(
					message,
					"Blurple",
					"Bot Clusters:",
					false,
					"✉️",
					true
				);

				embed.addFields(...filedData);

				return message.channel.send({
					embeds: [embed.toJSON()],
				});
			});
	}
}
