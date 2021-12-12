import { Message } from "discord.js/typings/index.js";
import { UserLeveling } from "../interfaces/Guild";
import { EventEmitter } from "events";
import Goose from "./Goose";

export class Leveling extends EventEmitter {
  public client: Goose;

  constructor(client: Goose) {
    super();

    this.client = client;
  }

  createData(guildID: string, userID: string) {
    if (this.client.leveling.has(`${guildID}-${userID}`)) return false;

    this.client.leveling.set(`${guildID}-${userID}`, {
      userID: userID,
      guildID: guildID,
      level: 0,
      xp: 0,
    });

    return true;
  }

  getData(guildID: string, userID: string): UserLeveling {
    var checkData = this.client.leveling.has(`${guildID}-${userID}`);
    if (!checkData) this.createData(guildID, userID);

    const data: UserLeveling = this.client.leveling.get(`${guildID}-${userID}`);
    return data;
  }

  setData(
    guildID: string,
    userID: string,
    newData: UserLeveling
  ): UserLeveling {
    if (!this.client.leveling.has(`${guildID}-${userID}`)) {
      this.createData(guildID, userID);
      return;
    }

    this.client.leveling.set(`${guildID}-${userID}`, newData);
    return this.client.leveling.get(`${guildID}-${userID}`) as UserLeveling;
  }

  // XP Managment

  addXP(guildID: string, userID: string, amount: number) {
    const data = this.getData(guildID, userID);
    data.xp += amount;

    this.setData(guildID, userID, data);
    return true;
  }

  subtractXP(guildID: string, userID: string, amount: number) {
    const data = this.getData(guildID, userID);

    if (data.xp < amount) amount = data.xp;
    data.xp -= amount;

    this.setData(guildID, userID, data);
    return true;
  }

  setXP(guildID: string, userID: string, amount: number) {
    const data = this.getData(guildID, userID);
    data.xp = amount;

    this.setData(guildID, userID, data);
    return true;
  }

  // Level Managment
  addLevel(guildID: string, userID: string, amount: number) {
    const data = this.getData(guildID, userID);
    data.level += amount;

    this.setData(guildID, userID, data);
    return true;
  }

  subtractLevel(guildID: string, userID: string, amount: number) {
    const data = this.getData(guildID, userID);

    if (data.level < amount) amount = data.level;
    data.level -= amount;

    this.setData(guildID, userID, data);
    return true;
  }

  setLevel(guildID: string, userID: string, amount: number) {
    const data = this.getData(guildID, userID);
    data.level = amount;

    this.setData(guildID, userID, data);
    return true;
  }

  // Other
  getRank(guildID: string, userID: string) {
    const all = this.client.leveling.fetchEverything();

    const levelsSorted: UserLeveling[] = all
      .array()
      .filter((data: UserLeveling) => data.guildID === guildID)
      .sort((a: UserLeveling, b: UserLeveling) => b.level - a.level);

    const sorted = levelsSorted.sort((a: UserLeveling, b: UserLeveling) => b.level - a.level || b.xp - a.xp);

    const index = sorted.findIndex((userData) => userData.userID === userID);
    return index + 1;
  }

  leaderboard(guildID: string): Leaderboard[] {
    const all = this.client.leveling.fetchEverything();
    const users = [];

    const levelsSorted: UserLeveling[] = all
      .array()
      .filter((data: UserLeveling) => data.guildID === guildID)
      .sort((a: UserLeveling, b: UserLeveling) => b.level - a.level)
      .slice(0, 20);

    const sorted = levelsSorted.sort((a: UserLeveling, b: UserLeveling) => b.level - a.level || b.xp - a.xp);

    for(const user of sorted) {
      const place = this.getRank(user.guildID, user.userID);
      const level = user.level;
      const xp = user.xp;
      
      users.push({
        userID: user.userID,
        place, 
        level, 
        xp
      });
    }

    return users;
  }

  xpForNextLevel(guildID: string, userID: string) {
    const data = this.getData(guildID, userID);
    const requiredLevel = data.level + 1;
    const formula = 5 * (requiredLevel ^ 2) + 50 * requiredLevel + 100;

    return formula;
  }

  handle(message: Message) {
    const data = this.getData(message.guild.id, message.author.id);
    const formula = 5 * (data.level ^ 2) + 50 * data.level + 100 - data.xp;

    if (data.xp > formula) {
      data.xp = 0;
      data.level += 1;

      this.setData(message.guild.id, message.author.id, data);
      this.emit("newLevel", {
        userID: message.author.id,
        guildID: message.guild.id,
        channelID: message.channel.id,
        level: data.level + 1,
      });

      return;
    }
  }
}

interface Leaderboard {
  userID: string;
  place: number;
  level: number;
  xp: number;
}