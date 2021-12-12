export interface GuildData {
  prefix: string;
  language: string;
  
  membersChannel: string;
  logChannel: string;
  levelsChannel: string;

  autoRole: string;
  muteRole: string;

  antilink: string;
  antispam: string;
  antiinvite: string;

  djRoles: Array<DJRoles>;
  immunityUsers: Array<ImmunityUsers>;

  welcomeText: LanguageReturns;
  byeText: LanguageReturns;

  twitchEnabled: string;
  twitchChannelID: string;
  twitchStreamers: Array<StreamerData>;
}

interface LanguageReturns {
  en: string;
  ru: string;
}

interface ImmunityUsers {
  userID: string;
}

interface DJRoles {
  roleID: string;
}

export interface StreamerData {
  name: string;
  latestStream: string;
}

interface VideoData {
  id: string;
}

export interface Events {
  status?: boolean;
  name: string;
}

export interface UserLeveling {
  userID: string;
  guildID: string;
  xp: number;
  level: number;
}