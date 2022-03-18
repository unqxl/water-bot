import Event from "../../types/Event/Event";
import Bot from "../../classes/Bot";
import index from "../../index";
import { EmbedBuilder, TextChannel, Util } from "discord.js";

interface INewLevelData {
	userID: string;
	guildID: string;
	channelID: string;
	level: number;
}

export default class NewLevelEvent extends Event {
	constructor() {
		super("newLevel", index.levels);
	}

	async run(client: Bot, data: INewLevelData) {
		const guild = client.guilds.cache.get(data.guildID);
		if (!guild) return;

		const settings = await client.database.getSettings(guild.id);

		const member = guild.members.cache.get(data.userID);
		if (!member) return;

		const channel = guild.channels.cache.get(data.channelID) as TextChannel;
		if (!channel) return;

		const lang_file = await client.functions.getLanguageFile(guild.id);
		const description = lang_file.EVENTS.LEVELING.NEWLEVEL(
			member.toString(),
			client.functions.sp(data.level)
		);

		const happend_at = lang_file.EVENTS.HAPPEND_AT(
			new Date().toLocaleString(settings.locale)
		);

		const embed = new EmbedBuilder()
			.setColor(Util.resolveColor("Blurple"))
			.setAuthor({
				name: member.user.tag,
				iconURL: member.user.displayAvatarURL(),
			})
			.setDescription(description)
			.setFooter({
				text: happend_at,
			});

		return channel.send({
			embeds: [embed.toJSON()],
		});
	}
}
