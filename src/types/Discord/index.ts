import { ColorResolvable, Guild, Message, MessageEmbed } from "discord.js";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import { RawGuildData, RawMessageData } from "discord.js/typings/rawDataTypes";
import { bold } from "@discordjs/builders";
import Bot from "classes/Bot";

// @ts-ignore
export class AkayoMessage extends Message {
	declare client: Bot;
	declare guild: AkayoGuild;

	constructor(client: Bot, data: RawMessageData) {
		super(client, data);
	}

	embed(
		color: ColorResolvable,
		text: string,
		footer: string | boolean,
		emoji: string | boolean,
		showAuthor: boolean,
		showTimestamp?: boolean
	): MessageEmbed {
		const embed = new MessageEmbed();

		if (showAuthor === true)
			embed.setAuthor({
				name: this.author.username,
				iconURL: this.author.displayAvatarURL({ dynamic: true }),
			});
		if (showTimestamp === true) embed.setTimestamp();

		embed.setColor(color);
		embed.setDescription(
			typeof emoji === "string" ? `${emoji} | ${bold(text)}` : text
		);
		embed.setFooter(typeof footer === "string" ? footer : null);

		return embed;
	}
}

// @ts-ignore
export class AkayoGuild extends Guild {
	declare client: Bot;

	constructor(client: Bot, data: RawGuildData) {
		super(client, data);
	}

	get settings(): Promise<GuildConfiguration> {
		return this.client.database.getSettings(this.id);
	}

	get language(): Promise<string> {
		return this.client.database.getSetting(this.id, "locale");
	}
}
