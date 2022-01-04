import {
	Message,
	MessageEmbed,
	TextChannel,
	MessageButton,
	MessageActionRow,
} from "discord.js";
import { RunFunction } from "../../interfaces/Event";

export const name: string = "messageUpdate";

export const run: RunFunction = async (
	client,
	oldMSG: Message,
	newMSG: Message
) => {
	if (!oldMSG.inGuild() || !newMSG.inGuild()) return;
	if (!oldMSG || !newMSG) return;
	if (oldMSG.content === newMSG.content) return;
	if(oldMSG.author.bot || newMSG.author.bot) return;

	const logChannelID = client.database.getSetting(newMSG.guild, "logChannel");
	if (logChannelID === "0") return;

	const logChannel = newMSG.guild.channels.cache.get(
		logChannelID
	) as TextChannel;
	if (!logChannel) return;

	const lang = await client.functions.getLanguageFile(newMSG.guild);
	const guildLocale = client.database.getSetting(newMSG.guild, "language");

	// Texts
	const [title, description, redirectText] = await Promise.all([
		lang.EVENTS.MESSAGE_EVENTS.UPDATE.TITLE,
		lang.EVENTS.MESSAGE_EVENTS.UPDATE.DESCRIPTION.replace(
			"{author}",
			newMSG.author.toString()
		)
			.replace("{oldContent}", oldMSG.content)
			.replace("{newContent}", newMSG.content)
			.replace("{date}", new Date().toLocaleString(guildLocale)),
		lang.EVENTS.MESSAGE_EVENTS.UPDATE.GO_TO,
	]);

	const RedirectButton = new MessageButton()
		.setStyle("LINK")
		.setURL(newMSG.url)
		.setLabel(redirectText);

	const row = new MessageActionRow().addComponents([RedirectButton]);
	const embed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor({
			name: newMSG.author.tag,
			iconURL: newMSG.author.displayAvatarURL({ dynamic: true })
		})
		.setTitle(title)
		.setDescription(description)
		.setTimestamp();

	return logChannel.send({
		embeds: [embed],
		components: [row],
	});
};
