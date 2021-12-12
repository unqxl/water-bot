import { MessageEmbed, TextChannel } from "discord.js";
import { Base } from "discord-moderation/src/typings/Base";
import { RunFunction } from "../../interfaces/Event";
import { bold } from "@discordjs/builders";
import client from "../..";
import ms from "ms";

interface MuteMember {
  id: number;
  type: string;
  guildID: string;
  memberID: string;
  moderatorID: string;
  channelID: string;
  reason: string;
  time?: number;
  unmutedAt?: number;
}

export const name: string = "muteMember";
export const emitter: Base = client.moderation;

export const run: RunFunction = async (client, data: MuteMember) => {
  const guild = client.guilds.cache.get(data.guildID);
  const lang = await client.functions.getLanguageFile(guild);
  const guildLocale = client.database.getSetting(guild, 'language');

  const member = guild.members.cache.get(data.memberID);
  const moderator = guild.members.cache.get(data.moderatorID);
  const channel = guild.channels.cache.get(data.channelID);
  const reason = data.reason;

  const temporaryMute = lang.EVENTS.MODERATION.MUTE_TYPES.TEMPORARY;
  const defaultMute = lang.EVENTS.MODERATION.MUTE_TYPES.DEFAULT;

  const [tType, mMember, mModerator, cChannel, rReason, tTime, uUnmutingAt] = [
    lang.EVENTS.MODERATION.MUTE_MEMBER.TYPE,
    lang.EVENTS.MODERATION.MUTE_MEMBER.MEMBER,
    lang.EVENTS.MODERATION.MUTE_MEMBER.MODERATOR,
    lang.EVENTS.MODERATION.MUTE_MEMBER.CHANNEL,
    lang.EVENTS.MODERATION.MUTE_MEMBER.REASON,
    lang.EVENTS.MODERATION.MUTE_MEMBER.TIME,
    lang.EVENTS.MODERATION.MUTE_MEMBER.UNMUTING_AT,
  ];

  var type = "";
  var title = "";
  var text = "";

  if (data.type === "tempmute") {
    type = temporaryMute;
    title = lang.EVENTS.MODERATION.MUTE_MEMBER.TEMPORARY_TITLE;
  } else if (data.type === "mute") {
    type = defaultMute;
    title = lang.EVENTS.MODERATION.MUTE_MEMBER.DEFAULT_TITLE;
  }

  text += `› ${bold(tType)}: ${bold(type)}\n`;
  text += `› ${bold(mMember)}: ${bold(member.toString())}\n`;
  text += `› ${bold(mModerator)}: ${bold(moderator.toString())}\n`;
  text += `› ${bold(cChannel)}: ${bold(channel.toString())}\n`;
  text += `› ${bold(rReason)}: ${bold(reason)}\n`;

  if (data.type === "tempmute") {
    const time = ms(data.time, { long: true });
    const unmutingdAt = new Date(data.unmutedAt).toLocaleString(guildLocale);

    text += `› ${bold(tTime)}: ${bold(time)}\n› ${bold(uUnmutingAt)}: ${bold(
      unmutingdAt
    )}`;
  }

  const embed = new MessageEmbed()
    .setColor("BLURPLE")
    .setAuthor(
      moderator.user.username,
      moderator.user.displayAvatarURL({ dynamic: true })
    )
    .setTitle(title)
    .setDescription(text)
    .setTimestamp();

  const logChannelID = client.database.getSetting(guild, "logChannel");
  if (logChannelID === "0") return;

  const logChannel = guild.channels.cache.get(logChannelID) as TextChannel;
  if (!logChannel) return;

  return logChannel.send({
    embeds: [embed],
  });
};
