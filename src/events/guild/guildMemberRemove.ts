import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { bold } from '@discordjs/builders';
import { RunFunction } from '../../interfaces/Event'

export const name: string = 'guildMemberRemove';

export const run: RunFunction = async(client, member: GuildMember) => {
    const membersChannelID = client.database.getSetting(member.guild, 'membersChannel');
    if(membersChannelID === '0') return;

    const membersChannel = member.guild.channels.cache.get(membersChannelID) as TextChannel;
    if(!membersChannel) return;

    const lang = await client.functions.getLanguageFile(member.guild);
    const locale = client.database.getSetting(member.guild, 'language');
    const texts = client.database.getSetting(member.guild, 'byeText');
    const title = lang.EVENTS.GUILD_EVENTS.MEMBER_REMOVE;
    const text = locale === 'en-US' ? texts.en : texts.ru;

    text
        .replace('{user_mention}', member.toString())
        .replace('{members}', member.guild.memberCount.toLocaleString());

    const embed = new MessageEmbed()
    .setColor('BLURPLE')
    .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
    .setTitle(title)
    .setDescription(bold(text))
    .setTimestamp();

    return membersChannel.send({
        embeds: [embed]
    });
}