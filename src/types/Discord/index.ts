import {
	ColorResolvable,
	Guild,
	Message,
	Embed,
	Util,
	CommandInteraction,
} from "discord.js";
import {
	RawGuildData,
	RawInteractionData,
	RawMessageData,
} from "discord.js/typings/rawDataTypes";
import { GuildConfiguration } from "../../typeorm/entities/GuildConfiguration";
import { bold } from "@discordjs/builders";
import Bot from "classes/Bot";

// @ts-expect-error
class Message extends Message {
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
	): Embed {
		const embed = new Embed();

		if (showAuthor === true) {
			embed.setAuthor({
				name: this.author.username,
				iconURL: this.author.displayAvatarURL(),
			});
		}

		if (showTimestamp === true) embed.setTimestamp();

		embed.setColor(Util.resolveColor(color));
		embed.setDescription(
			typeof emoji === "string" ? `${emoji} | ${bold(text)}` : text
		);
		embed.setFooter(typeof footer === "string" ? { text: footer } : null);

		return embed;
	}
}

class AkayoCommandInteraction extends CommandInteraction {
	declare client: Bot;
	declare guild: AkayoGuild;

	constructor(client: Bot, data: RawInteractionData) {
		super(client, data);
	}

	embed(
		color: ColorResolvable,
		text: string,
		footer: string | boolean,
		emoji: string | boolean,
		showAuthor: boolean,
		showTimestamp?: boolean
	): Embed {
		const embed = new Embed();

		if (showAuthor === true)
			embed.setAuthor({
				name: this.user.username,
				iconURL: this.user.displayAvatarURL(),
			});
		if (showTimestamp === true) embed.setTimestamp();

		embed.setColor(Util.resolveColor(color));
		embed.setDescription(
			typeof emoji === "string" ? `${emoji} | ${bold(text)}` : text
		);
		embed.setFooter(typeof footer === "string" ? { text: footer } : null);

		return embed;
	}
}

// @ts-expect-error
class AkayoGuild extends Guild {
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

export { Message, AkayoGuild, AkayoCommandInteraction };
