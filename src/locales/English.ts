export default {
	BOTOWNER: {
		LEFT_GUILD: (id) => `Successfully left Guild with ID "${id}"`,
		COMMAND_RELOADED: (name) =>
			`Command with name "${name}" successfully reloaded!`,
	},

	ECONOMY: {
		COINS: "Coins",
		BALANCE: "Balance",
		BANK: "Bank",

		TIME_ERROR: (time) =>
			`You've already received your reward!\nTry again in ${time}`,
		DAILY_REWARD: (coins) =>
			`You've received ${coins} coins as a Daily Reward!`,
		WORK_REWARD: (coins) =>
			`You've received ${coins} coins as a Work Reward!`,
		WEEKLY_REWARD: (coins) =>
			`You've received ${coins} coins as a Weekly Reward!`,
		BALANCE_ADDED: (amount, member) =>
			`Successfully added ${amount} Coins to ${member} Balance!`,
		BALANCE_SUBT: (amount, member) =>
			`Successfully subtracted ${amount} Coins from the ${member} Balance!`,
		BANK_DEPOSITED: (amount) =>
			`Successfully deposited ${amount} Coins to Your Bank!`,
		BANK_WITHDREW: (amount) =>
			`Successfully withdrew ${amount} Coins from Your Bank!`,
		BALANCE_INFO: (balance, bank) =>
			`Balance: ${balance} coins,\nBank Balance: ${bank} coins.`,
		GIFTED: (amount, user, balance) =>
			`Successfully gifted ${amount} coins to ${user}!\n\nYour Balance: ${balance} coins`,

		CASES: {
			BRONZE: "Bronze Case",
			SILVER: "Silver Case",
			GOLD: "Gold Case",

			CHOOSE_TEXT: "To continue, choose one of three availiable cases!",
			NOTE: "You have 30 seconds to choose case!",
			PRIZE_TEXT: (case_name, prize) =>
				`You openned ${case_name} and won ${prize} coins!`,
			TIME_IS_OVER: "Time is over!",
		},
	},

	ECONOMY_ACTIONS: {
		WITHDRAW: "Withdraw from the Bank",
		DEPOSIT: "Deposit into the Bank",
		BUY_CASE: "Buy the Case",
		GIFT: "Gift",
	},

	GAMES: {
		CAPTCHA: {
			TEXT: (reward) =>
				`Solve the Captcha to Earn ${reward} coins!\nYou have 15 seconds!`,
			WRONG_ANSWER: "Your answer was incorrect, the game is ended!",
			CORRECT_ANSWER: (coins) =>
				`Your answer was correct, You got ${coins} coins to Your Balance!`,
			TIMEOUT: "Time's up, the game is ended!",
		},

		PHASMOPHOBIA: {
			GHOSTS: {
				BANSHEE: "Banshee",
				GORYO: "Goryo",
				DEMON: "Demon",
				JINN: "Jinn",
				SPIRIT: "Spirit",
				SHADE: "Shade",
				PHANTOM: "Phantom",
				HANTU: "Hantu",
				MARE: "Mare",
				WRAITH: "Wraith",
				REVENANT: "Revenant",
				RAIJU: "Raiju",
				THE_TWINS: "The Twins",
				POLTERGEIST: "Poltergeist",
				MYLING: "Myling",
				MIMIC: "The Mimic",
				YUREI: "Yurei",
				YOKAI: "Yokai",
				ONI: "Oni",
				ONRYO: "Onryo",
				OBAKE: "Obake",
			},

			EVIDENCES: {
				EMF: "EMF-5",
				DOTS: "D.O.T.S",
				ORBS: "Ghost Orbs",
				FINGERPRINTS: "Fingerprints",
				WRITING: "Ghost Writing",
				FREEZING: "Freezing",
				SPIRIT_BOX: "Spirit Box",
			},

			WELCOME: (type) =>
				`Welcome to the Phasmophobia in Discord!\nIn this game you will get ghost type and you need to choose correct evidences for this ghost!\n\nIf you choose correct evidence - you will get 500 coins.\nIf not - ghost will eat you :3\nYou have 30 seconds to choose!\n\nLet's start! Your ghost type is ${type}, choose correct evidences to win!`,
			WIN: "Congratulations!\nYou won this game and got 150 coins into your Balance!",
			DEFEAT: (correct) =>
				`You're lost!\nYou lose this game and ghost eat you :3!\nCorrect Evidences: ${correct}`,
			TIMEOUT: "Time is over, ghost eat you :3!",
		},

		RPS: {
			ITEMS: {
				ROCK: "Rock",
				PAPER: "Paper",
				SCISSORS: "Scissors",
			},

			WAITING_FOR_OPPONENT: (opponent) => `Waiting for ${opponent}...`,
			FOOTER: "Game: Rock-Paper-Scissors",
			ACCEPT_CHALLENGE: (opponent, author) =>
				`Hey, ${opponent}!\n${author} invited you to play Rock-Paper-Scissors!`,
			VERSUS: (opponent, author) => `${opponent} VS ${author}`,
			TIMEOUT: "Game is ended!\nOne of players didn't make a move!",
			FINAL: (winner) =>
				`Winner of this game is ${winner}, congratulations!`,
			DRAW: "Draw, congratulations!",
			NO_ANSWER: (opponent) =>
				`${opponent} hasn't responded to your offer to play!`,
			DECLINED: (opponent) => `${opponent} refused to play with you!`,
		},

		GUESS_THE_FLAG: {
			DESCRIPTION: (reward) => `Guess the Flag to earn ${reward} coins!`,
			WIN: (name, official_name, currency, languages) =>
				`Congratulations, you won this game!\n\n› Name: ${name} (${official_name})\n› Currency: ${currency}\n› Languages: ${languages}`,
			DEFEAT: (name, official_name, currency, languages) =>
				`Wrong answer!\n\n› Name: ${name} (${official_name})\n› Currency: ${currency}\n› Languages: ${languages}`,
			TIMEOUT: (name, official_name, currency, languages) =>
				`Time is out!\n\n› Name: ${name} (${official_name})\n› Currency: ${currency}\n› Languages: ${languages}`,
			FOOTER: "Game: Guess the Flag",
		},

		GUESS_THE_LOGO: {
			DESCRIPTION: (reward, clue, hint) =>
				`Guess the Logo to earn ${reward} coins!\n\n› Clue: ${clue}\n› Hint: ${hint}`,
			WIN: (brand, wiki) =>
				`Congratulations, you won this game!\n\n› Brand: ${brand}\n› Wiki: ${wiki}`,
			DEFEAT: (brand, wiki) =>
				`Wrong answer!\n\n› Brand: ${brand}\n› Wiki: ${wiki}`,
			TIMEOUT: (brand, wiki) =>
				`Time is out!\n\n› Brand: ${brand}\n› Wiki: ${wiki}`,
			FOOTER: "Game: Guess the Logo",
		},
	},

	LEVELING: {
		ADDED_LEVEL: (level, target) =>
			`Successfully added ${level} level(s) to ${target}!`,
		ADDED_XP: (xp, target) => `Successfully added ${xp} XP to ${target}!`,
	},

	MODERATION: {
		BANNED: (target, reason, moderator) =>
			`Successfully banned ${target}!\nReason: ${reason}\nModerator: ${moderator}`,
		KICKED: (target, reason, moderator) =>
			`Successfully kicked ${target}!\nReason: ${reason}\nModerator: ${moderator}`,
		MUTED: (target, reason, moderator) =>
			`Successfully muted ${target}!\nReason: ${reason}\nModerator: ${moderator}`,
		CLEARED: (amount) => `Successfully deleted ${amount} messages!`,
		TEMPMUTED: (target, time, reason, moderator) =>
			`Successfully temporary muted ${target}!\nTime: ${time}\nReason: ${reason}\nModerator: ${moderator}`,
		UNMUTED: (target) => `Successfully unmuted ${target}!`,
		UNWARNED: (target) => `Successfully deleted last warn from ${target}!`,
		WARNED: (target, reason, moderator) =>
			`Successfully warned ${target}!\nReason: ${reason}\nModerator: ${moderator}`,
		EMOJI_CREATED: (name) =>
			`Emoji with name "${name}" successfully created in this server!`,
	},

	MUSIC: {
		LOOP_MODES: {
			OFF: "Disabled",
			SONG: "Song",
			QUEUE: "Queue",
		},

		LOOP_CHANGES: (mode) => `Repeat Mode changed to ${mode}`,
		NOW_PLAYING: (name) => `Now Playing - \`${name}\``,

		SONG_INFO: {
			NAME: "Song Name",
			URL: "Song URL",
			VIEWS: "Song Views",
			DURATION: "Song Duration",
			REQUESTED_BY: "Requsted by",
		},

		PAUSED: "Current Song is Paused!",
		QUEUE: "Current Server Queue",
		RESUMED: "Current Song is Resumed!",
		SHUFFLED: "Server Queue is Shuffled!",
		SKIPPED: "Current Song is Skipped!",
		STOPPED: "Current Server Queue is Stopped!",

		VOLUME_NOW: (volume) => `Current Music Volume - ${volume}%`,
		VOLUME_SETTED: (volume) => `Current Music Volume changed to ${volume}%`,
	},

	OTHER: {
		BOTINFO: {
			TITLE: "Statistics",
			GUILDS: "Guilds",
			USERS: "Users",
			EMOJIS: "Emojis",
			CHANNELS: "Channels",
			EVENTS: "Events",
			COMMANDS: "Commands",
			UPTIME: "Bot Uptime",
			STARTED_AT: "Started At",
			API_PING: "API Ping",
			BOT_VERSION: "Bot Version",
			FIELD_NAME: "Bot Information",
		},

		HELP: {
			CATEGORIES: {
				BOT_OWNER: "Bot Owner",
				ECONOMY: "Economy",
				FUN: "Fun",
				MODERATION: "Moderation",
				MUSIC: "Music",
				OTHER: "Other",
				SETTINGS: "Settings",
				GAMES: "Games",
				LEVELING: "Leveling",
				GIVEAWAYS: "Giveaways",
				ROLEPLAY: "Role Play",
			},

			COMMAND: {
				NAME: "Name",
				DESCRIPTION: "Description",
				ALIASES: "Aliases",
				USAGE: "Usage",
				CATEGORY: "Category",
				BOT_PERMISSIONS: "Bot Permissions",
				MEMBER_PERMISSIONS: "Member Permissions",
			},

			COMMANDS_LENGTH: "Commands",
		},

		SERVER_INFO: {
			TITLE: "Server Information",

			FIELDS: {
				ZERO: "Information",
				FIRST: "Presences",
				SECOND: "Members",
				THIRD: "Channel",
			},

			STATUSES: {
				ONLINE: "Online",
				IDLE: "Idle",
				DND: "DND",
			},

			MEMBER_TYPES: {
				HUMANS: "Humans",
				BOTS: "Bots",
			},

			CHANNELS: {
				TEXT: "Text",
				NEWS: "News",
				VOICE: "Voice",
				STAGE: "Stage",
				CATEGORIES: "Categories",
			},

			OTHER: {
				GUILD_ID: "Guild ID",
				OWNER: "Owner",
				MEMBER_COUNT: "Members",
				CREATED_AT: "Created At",
			},
		},

		USER_INFO: {
			CLIENT_STATUSES: {
				WEB: "Web",
				DESKTOP: "Desktop",
				MOBILE: "Mobile",
			},

			OTHER: {
				NOT_PLAYING: "Not Playing",
				NOTHING: "Nothing",
			},

			FIELDS: {
				MAIN: "Main",
				OTHER: "Other",
			},

			TEXTS: {
				MAIN: {
					USERNAME: "Username",
					TAG: "Tag",
					AVATAR: "Avatar",
				},

				OTHER: {
					ONLINE_USING: "Online Using",
					PRESENCE: "Presence",
					PLAYING: "Playing",
					REG_DATE: "Reg. Date",
					JOIN_DATE: "Join Date",
					IN_VOICE: "In Voice",
					BOOSTING: "Boosing",
					BOT: "Bot",
				},
			},
		},

		SOURCE: {
			TEXT: (url) =>
				`Recently, the bot's source code is available in my repository on GitHub: ${url}`,
		},

		COVID: {
			CASES: "Cases",
			RECOVERED: "Recovered",
			DEATHS: "Deaths",
			TOTAL: "Total",
			TODAY: "Today",
			CRITICAL: "Critical",
			TESTS: "Tests",
			LAST_UPDATED: "Last updated",
			TOTAL_POPULATION: "Population",
		},

		STEAM: {
			FIELDS: {
				ABOUT: "About the Game",
				LANGUAGES: "Supported Languages",
				DEVELOPERS: "Developers",
				PLATFORMS: "Supported Platforms",
				CATEGORIES: "Game Categories",
				GENRES: "Game Genres",
				RECOMENDATIONS: "Total Recomendations",
				RELEASE_DATE: "Release Date",
				PRICE: "Game Price",
				NOTES: "Notes",
			},

			PLATFORMS: {
				WINDOWS: "Windows",
				MACOS: "MacOS",
				LINUX: "Linux",
			},

			COMING_SOON: "Coming Soon",
			DATE: "Release Date",
			PRICE: "Price",
			DISCOUNT: "Discount",
		},
	},

	SLASH_COMMANDS: {
		ACTIVITY: {
			INVITE: "Here's Your Invite: {url}",
		},
	},

	SETTINGS: {
		CONFIG: {
			TYPES: {
				CUSTOM_COMMANDS: "Custom Commands",
				LANGUAGE: "Guild Language",
				MEMBERS_CHANNEL: "Members Channel",
				LOG_CHANNEL: "Log Channel",
				TWITCH_CHANNEL: "Twitch Notifications Channel",
				AUTO_ROLE: "Auto Role",
				MUTE_ROLE: "Mute Role",
				DJ_ROLES: "DJ Roles",
				TWITCH_SYSTEM: "Twitch System",
				TWITCH_STREAMERS: "Twitch Streamers",
				PREFIX: "Prefix",
			},
		},

		SETTED: (type, value) => `Successfully changed "${type}" to "${value}"`,
		RESETTED: (type, value?) =>
			`Successfully resetted "${type}" to default${
				value !== undefined ? ` (${value})` : ""
			}`,
		ADDED: (type, value) => `Successfully added "${value}" into "${type}"`,
		DELETED: (type, value) =>
			`Successfully deleted "${value}" from "${type}"`,
		ENABLED: (type) => `Successfully enabled "${type}"`,
		DISABLED: (type) => `Successfully disabled "${type}"`,
		SHOW: (type, value) => `Server's "${type}" - ${value}`,

		LANGUAGE_CHANGED_NOTE:
			"If you did this by accident, then use the command 'language-reset'",
	},

	GIVEAWAYS: {
		PROMPTS: {
			CREATE_WINNERS: "Write the Count of Winners (10s)",
			CREATE_PRIZE: "Write the Prize of Giveaway (20s)",
			CREATE_TIME: "Write the Time of Giveaway (20s | 2d, 10m)",
		},

		ERRORS: {
			ERROR_WINNERS: "You didn't specify the Count of Winners!",
			ERROR_PRIZE: "You didn't specify the Prize of Giveaway!",
			ERROR_TIME: "You didn't specify the Time of Giveaway!",
		},

		MESSAGES: {
			giveaway: "🎉 Giveaway 🎉",
			giveawayEnded: "🎉 Giveaway Ended 🎉",
			inviteToParticipate: "React with 🎉 to participate!",
			dropMessage: "Be first to react with 🎉!",
			drawing: "Drawing: {timestamp}",
			winMessage:
				"Congradulations, {winners}!\nYou won: **{this.prize}**",
			embedFooter: "Giveaways",
			hostedBy: "Hosted By: {this.hostedBy}",
			winners: "Winner(s):",
			endedAt: "Ended At",
		},

		RESPONSES: {
			ENDED: (id: string) =>
				`Giveaway with ID "\`${id}\`" successfully ended!`,
		},
	},

	ROLEPLAY: {
		ACTIONS: {
			TICKLE: (author, target) => `${author} tickled ${target}!`,
			BAKA: (author, target) => `${author} hates ${target}!`,
			SLAP: (author, target) => `${author} slapped ${target}!`,
			POKE: (author, target) => `${author} pokked into ${target}!`,
			PAT: (author, target) => `${author} patted ${target}!`,
			KISS: (author, target) => `${author} kissed ${target}!`,
			HUG: (author, target) => `${author} hugged ${target}!`,
		},

		OTHER: {
			CLICK_IF_NOT: (url) =>
				`Click [here](${url}) if You don't see the picture!`,
		},
	},

	ERRORS: {
		NO_ACCESS: "You have not access to use this command!",
		MEMBER_MISSINGPERMS: (perms) =>
			`You don't have the following Permissions for this command: ${perms}`,
		BOT_MISSINGPERMS: (perms) =>
			`I don't have the following Permissions for this command: ${perms}`,
		ARGS_MISSING: (cmd_name) =>
			`You missed an important argument!\nUse the \`help ${cmd_name}\` command to get a usage example!`,
		EVAL_CANCELED:
			"The code processing process was canceled ahead of time, as the response may contain personal information!",
		GUILD_NOT_FOUND: (id) => `Guild with ID \`${id}\` isn\`t found!`,
		IS_NAN: (input) => `\`${input}\` is not a Number!`,
		USER_BOT: (target) => `${target} is a Bot!`,
		NOT_ENOUGH_MONEY: (action) => `You have not enough coins to ${action}`,
		MEMBER_NOT_BANNABLE: (target) =>
			`Cannot ban ${target} because he has Immunity for this!`,
		MEMBER_NOT_KICKABLE: (target) =>
			`Cannot kick ${target} because he has Immunity for this!`,
		NO_MUTEROLE: "To use this command, Server must have a Mute Role!",
		NO_MUTE: (member) => `${member} has not any type of active mute!`,
		NO_WARNS: (member) => `${member} has not any warns!`,
		NOT_JOINED_VOICE: "To use this command You need to join Voice Channel!",
		JOIN_BOT_VOICE:
			"To use this command You need to join Bot Voice Channel!",
		QUEUE_EMPTY: "Server Queue is Empty!",
		PAUSED: "Current Song is paused!",
		RESUMED: "Current Song is resumed!",
		MISSING_IN_DB: (type) => `"${type}" value is missing in DB!`,
		CANNOT_BE_EVERYONE: (type) => `"${type}" cannot be everyone!`,
		SYSTEM_NOT_ENABLED: (type) => `"${type}" is not enabled!`,
		SYSTEM_ENABLED: (type) => `"${type}" is enabled!`,
		MISSING_IN_LIST: (value, list) =>
			`"${value}" isn't listed in list!\nChoises: ${list}`,
		CHANNEL_TYPE: "Channel type is not Text or News!",
		COMMAND_NOT_FOUND: (name) =>
			`Command with name "${name}" is not found!`,
		BALANCE_BOTS: "Bots Cannot have Balance!",
		GIFT_YOURSELF: "You cannot give coins to yourself!",
		NOT_FOUND: (src) => `Your query is not found in ${src}!`,
		NOT_FOUND_IN_DB: (type, value) =>
			`"${value}" is not found in "${type}"!`,
		ALREADY_IN_DB: (type, value) =>
			`"${value}" is already placed in "${type}"`,
		EMOJIS_LIMIT:
			"The limit on the number of emojis on the server has been reached!",
		VALID_EMOJI: "Please provide a valid emoji!",
		NORMAL_EMOJI: "You can use Normal Emoji without Adding in Server!",
		GIVEAWAY_NOT_FOUND: (id: string) =>
			`Giveaway with ID "\`${id}\`" not found!`,
		GIVEAWAY_ENDED: (id: string) =>
			`Giveaway with ID "\`${id}\`" already ended!`,
		COVID_NOT_FOUND: (name: string) =>
			`Cannot get COVID-19 data for "${name}"`,
	},

	FUNCTIONS: {
		TRIMARRAY: (len) => `${len} more...`,

		VERIFICATION: {
			ACCEPT: "Accept",
			DECLINE: "Decline",
			TEXT: "To complete, you need to confirm that you did not miss up anything.\nClick on the green button to continue or click on the red button to cancel the action!",
		},
	},

	TWITCH_HANDLER: {
		NEW_STREAM: "New Stream Started on Twitch!",
		STREAM_TITLE: "Stream Title",
		STARTED_AT: "Started At",
		GO_TO: "Go to the Stream",
	},

	PERMISSIONS: {
		ManageGuild: "Manage Guild (Server)",
		ManageRoles: "Manage Roles",
		ManageWebhooks: "Manage Webhooks",
		ManageMessages: "Manage Messages",
		ManageEmojisAndStickers: "Manage Emojis and Stickers",
		Administrator: "Administrator",
		BanMembers: "Ban Member",
		KickMembers: "Kick Members",
		CreateInstantInvite: "Create Instant Invite",
		EmbedLinks: "Embed Links",
		Speak: "Speak",
		Connect: "Connect",
	},

	GLOBAL: {
		BOT: "Bot",
		YES: "Yes",
		NO: "No",
		DAYJS_FORMAT: "D [day(s),] H [hr(s),] mm [min(s),] ss [sec(s)]",
		ENABLED: "Enabled",
		DISABLED: "Disabled",
		ACCEPT: "Accept",
		DECLINE: "Decline",
		NONE: "None",

		STATUSES: {
			ONLINE: "Online",
			IDLE: "Idle",
			DND: "DND",
			OFFLINE: "Offline",
		},
	},

	SYSTEMS: {
		DJ_ROLES: {
			HASNT_ANY:
				"You can't use this command because You don't have any DJ Role!",
		},
	},

	EVENTS: {
		GUILD_PREFIX: (guild_name, prefix) =>
			`Prefix for "${guild_name}": "\`${prefix}\`"`,
		HAPPEND_AT: (date) => `Happend at: ${date}`,

		GUILD_BIRTHDAY: {
			TEXT: (name, years, decl) =>
				`🎉 | "${name}" are celebrating their birthday today! This server is already ${years} ${decl}!`,
			YEAR: "year",
			YEARS: "years",
		},

		GUILD_EVENTS: {
			//guildMemberAdd | guildMemberRemove
			MEMBER_ADD: {
				TITLE: "⬆️ | New Member on the Server!",
				DESCRIPTION: (member) => `${member} just joined this server!`,
			},
			MEMBER_REMOVE: {
				TITLE: "⬇️ | Member left this Server!",
				DESCRIPTION: (member) => `${member} just left this server!`,
			},

			//guildMemberBoost | guildMemberUnboost
			MEMBER_BOOST: {
				TITLE: "🎉 | Member boosted this Server!",
				DESCRIPTION: (member, boosts) =>
					`${member} just boosted this server!\nServer Boosts: ${boosts}`,
			},
			MEMBER_UNBOOST: {
				TITLE: "😔 | Member unboosted this Server!",
				DESCRIPTION: (member, boosts) =>
					`${member} just unboosted this server!\nServer Boosts: ${boosts}`,
			},

			//guildMemberRoleAdd | guildMemberRoleRemove
			ROLE_ADD: {
				TITLE: "⬆️ | Member Got a Role!",
				DESCRIPTION: (member, role, moderator) =>
					`${member} just got a ${role} role by moderator ${moderator}`,
			},
			ROLE_REMOVE: {
				TITLE: "⬇️ | Member Lost a Role!",
				DESCRIPTION: (member, role, moderator) =>
					`${member} just lost a ${role} role by moderator ${moderator}`,
			},

			//guildBoostLevelUp | guildBoostLevelDown
			LEVEL_UP: {
				TITLE: "🎉 | Server Boost Level Upped!",
				DESCRIPTION: (new_level) =>
					`This Server just got new ${new_level} boost level!`,
			},
			LEVEL_DOWN: {
				TITLE: "😔 | Server Boost Level Downed!",
				DESCRIPTION: (new_level) =>
					`Server boost level downed to ${new_level} level!`,
			},

			//guildPartnerAdd | guildPartnerRemove
			PARTNERED: {
				TITLE: "🎉 | Server got Partnered!",
				DESCRIPTION:
					'This Server just got "Partnered" Status right now!',
			},
			UNPARTNERED: {
				TITLE: "😔 | Server got UnPartnered!",
				DESCRIPTION: 'Server just lost "Partnered" Status right now!',
			},

			//guildVerificationAdd | guildVerificationRemove
			VERIFIED: {
				TITLE: "🎉 | Server got Verified!",
				DESCRIPTION:
					'This Server just got "Verified" Status right now!',
			},
			UNVERIFIED: {
				TITLE: "😔 | Server got UnVerified!",
				DESCRIPTION: 'Server just lost "Verified" Status right now!',
			},

			//guildBanAdd | guildBanRemove
			BAN_ADD: {
				TITLE: "🛡️ | User got Banned!",
				DESCRIPTION: (member, tag, moderator, reason) =>
					`${member} (${tag}) just got banned by moderator ${moderator}\n› Reason: ${reason}`,
			},
			BAN_REMOVE: {
				TITLE: "🛡️ | User got Unbanned!",
				DESCRIPTION: (member, tag, moderator, reason) =>
					`${member} (${tag}) just got unbanned by moderator ${moderator}\n› Ban Reason: ${reason}`,
			},
		},

		LEVELING: {
			NEWLEVEL: (user, level) =>
				`🎉 | ${user} has raised it's level to ${level}`,
		},

		MESSAGE_EVENTS: {
			DELETE: {
				TITLE: "🗑️ | Message Deleted!",
				DESCRIPTION: (author, content) =>
					`Message from ${author} has been deleted!\n\n› Message Content: \`${content}\``,

				GHOST_PING: {
					TITLE: "⚠️ | Ghost Ping Detected",
					DESCRIPTION: (author, content) =>
						`Looks like that message from ${author} contains member mentions!\n\n› Message Content: \`${content}\``,
				},
			},
			UPDATE: {
				TITLE: "⬆️ | Message Updated!",
				DESCRIPTION: (author, old_content, new_content) =>
					`Message from ${author} has been updated!\n\n› Old Message Content: \`${old_content}\`\n› New Message Content: \`${new_content}\``,
				GO_TO: "Jump to Message",
			},
		},

		MUSIC_EVENTS: {
			ADD_SONG: {
				EMBED_TITLE: "🎶 | Adding Song to Queue",
				TITLE: "Song Title",
				URL: "Song URL",
				VIEWS: "Views",
				DURATION: "Duration",
				SONGS: "Songs in Queue",
				REQUESTED_BY: "Requested By",
			},

			PLAY_SONG: {
				EMBED_TITLE: "🎶 | Playing song from Queue",
				TITLE: "Song Title",
				URL: "Song URL",
				VIEWS: "Views",
				DURATION: "Duration",
				SONGS: "Songs in Queue",
				REQUESTED_BY: "Requested By",
			},

			ADD_LIST: {
				EMBED_TITLE: "🎶 | Adding Playlist to Queue",
				TITLE: "Playlist Title",
				URL: "Playlist URL",
				VIEWS: "Views",
				DURATION: "Duration",
				PLAYLIST_SONGS: "Songs in Playlist",
				SONGS: "Songs in Queue",
				REQUESTED_BY: "Requested By",
			},

			FINISH: "Music Queue is Over, bot left Voice Channel!",
			EMPTY: "Voice Channel is empty, bot left Voice Channel!",
			ERROR: (message) => `Oops, there's an error: ${message}`,
		},
	},

	MODULES: {
		STEAMID: {
			NOT_STEAMID:
				"The argument you specified is not like SteamID/SteamID3/SteamID64!",
			ANSWER: (steam_id, steam_id64, steam_id3, url) =>
				`SteamID: ${steam_id}\nSteamID64: ${steam_id64}\nSteamID3: ${steam_id3}\nProfile: [Click](${url})`,
		},
	},
};
