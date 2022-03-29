import { GuildClan } from "../interfaces/Clans";
import Bot from "../classes/Bot";

export = class ClanSystem {
	public client: Bot;

	constructor(client: Bot) {
		this.client = client;
	}

	async createClan(
		name: string,
		abr: string,
		guild_id: string,
		member_id: string
	): Promise<GuildClan | Return> {
		const lang = await this.client.functions.getLanguageFile(guild_id);

		const clansData = this.client.clansDB.get(guild_id);
		if (clansData.clans.find((x) => x.name === name || x.abr === abr)) {
			return {
				code: 409,
				message: lang.SYSTEMS.CLANS.ERRORS.CLAN_ALREADY_EXISTS,
			};
		}

		if (clansData.clans.find((x) => x.members.includes(member_id))) {
			return {
				code: 409,
				message: lang.SYSTEMS.CLANS.ERRORS.ALREADY_IN_CLAN,
			};
		}

		const data: GuildClan = {
			name: name,
			abr: abr,
			owner: member_id,
			membersCount: 1,
			members: [member_id],
		};

		clansData.clans.push(data);
		this.client.clansDB.set(guild_id, clansData);

		return data;
	}

	async deleteClan(
		owner: string,
		guild_id: string,
		member_id: string
	): Promise<boolean | Return> {
		const lang = await this.client.functions.getLanguageFile(guild_id);

		const clansData = this.client.clansDB.get(guild_id);
		if (!clansData.clans.find((x) => x.owner === owner)) {
			return {
				code: 404,
				message: lang.SYSTEMS.CLANS.ERRORS.CLAN_NOT_FOUND,
			};
		}

		const clan = clansData.clans.find((x) => x.owner === owner);
		if (clan.owner !== member_id) {
			return {
				code: 403,
				message: lang.SYSTEMS.CLANS.ERRORS.NOT_OWNER,
			};
		}

		clansData.clans.filter((x) => x.name !== clan.name);
		this.client.clansDB.set(guild_id, clansData);

		return true;
	}

	async joinClan(
		abr: string,
		guild_id: string,
		member_id: string
	): Promise<GuildClan | Return> {
		const lang = await this.client.functions.getLanguageFile(guild_id);

		const clansData = this.client.clansDB.get(guild_id);
		if (!clansData.clans.find((x) => x.abr === abr)) {
			return {
				code: 404,
				message: lang.SYSTEMS.CLANS.ERRORS.CLAN_NOT_FOUND,
			};
		}

		if (clansData.clans.find((x) => x.members.includes(member_id))) {
			return {
				code: 403,
				message: lang.SYSTEMS.CLANS.ERRORS.ALREADY_JOINED_CLAN,
			};
		}

		const clan = clansData.clans.find((x) => x.abr === abr);
		clan.members.push(member_id);
		clan.membersCount += 1;

		this.client.clansDB.set(guild_id, clansData);
		return clan;
	}

	async leaveClan(
		owner: string,
		guild_id: string,
		member_id: string
	): Promise<boolean | Return> {
		const lang = await this.client.functions.getLanguageFile(guild_id);

		const clansData = this.client.clansDB.get(guild_id);
		if (!clansData.clans.find((x) => x.owner === owner)) {
			return {
				code: 404,
				message: lang.SYSTEMS.CLANS.ERRORS.CLAN_NOT_FOUND,
			};
		}

		if (!clansData.clans.find((x) => x.members.includes(member_id))) {
			return {
				code: 403,
				message: lang.SYSTEMS.CLANS.ERRORS.NOT_IN_CLAN,
			};
		}

		const clan = clansData.clans.find((x) => x.owner === owner);
		clan.members = clan.members.filter((x) => x !== member_id);
		clan.membersCount = clan.membersCount -= 1;

		if (clan.membersCount <= 0) {
			clansData.clans = clansData.clans.filter((x) => x.owner !== owner);
		}

		this.client.clansDB.set(guild_id, clansData);
		return true;
	}

	async list(guild_id: string): Promise<GuildClan[] | Return> {
		const lang = await this.client.functions.getLanguageFile(guild_id);

		const clansData = this.client.clansDB.get(guild_id);
		if (!clansData.clans.length) {
			return {
				code: 404,
				message: lang.SYSTEMS.CLANS.ERRORS.NO_CLANS,
			};
		}

		return clansData["clans"];
	}

	async getMembers(
		owner: string | number,
		guild_id: string
	): Promise<GuildClan[] | Return> {
		const lang = await this.client.functions.getLanguageFile(guild_id);

		const clansData = this.client.clansDB.get(guild_id);
		if (!clansData.clans.length) {
			return {
				code: 404,
				message: lang.SYSTEMS.CLANS.ERRORS.NO_CLANS,
			};
		}

		const clan = clansData.clans.find((x) => x.owner === owner);
		if (!clan) {
			return {
				code: 404,
				message: lang.SYSTEMS.CLANS.ERRORS.CLAN_NOT_FOUND,
			};
		}

		const guild = this.client.guilds.cache.get(guild_id);
		if (!guild) {
			return {
				code: 403,
				message: lang.SYSTEMS.CLANS.ERRORS.CANNOT_FETCH,
			};
		}

		const members = [];
		for (const clanMember of clan.members) {
			var member = guild.members.cache.get(clanMember);
			if (!member) {
				guild.members
					.fetch()
					.then((data) => {
						member = data.get(clanMember);
					})
					.catch(() => {
						return {
							code: 403,
							message:
								lang.SYSTEMS.CLANS.ERRORS.CANNOT_FETCH_MEMBER,
						};
					});
			}

			members.push(member.toString());
		}

		return members;
	}
};

interface Return {
	code: number;
	message: string;
}
