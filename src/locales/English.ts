export default {
	BOTOWNER: {
		LEFT_GUILD: 'Successfully left Guild with ID "{id}"',
		UPDATED_DB: "Successfully Updated all the Servers Configuration!",
		COMMAND_RELOADED: (name) => `Command with name "${name}" successfully reloaded!`
	},

	ECONOMY: {
		COINS: "Coins",
		BALANCE: "Balance",
		BANK: "Bank",
		TIME_ERROR: "You've already received your reward!\nTry again in {time}",
		DAILY_REWARD: "You've received {coins} coins as a Daily Reward!",
		WORK_REWARD: "You've received {coins} coins as a Work Reward!",
		WEEKLY_REWARD: "You've received {coins} coins as a Weekly Reward!",
		BALANCE_ADDED: "Successfully added {amount} Coins to {member} Balance!",
		BALANCE_SUBT:
			"Successfully subtracted {amount} Coins from the {member} Balance!",
		BANK_DEPOSITED: "Successfully deposited {amount} Coins to Your Bank!",
		BANK_WITHDREW: "Successfully withdrew {amount} Coins from Your Bank!",
		BALANCE_INFO: "Balance: {balance} coins,\nBank Balance: {bank} coins.",
		GIFTED: "Successfully gifted {amount} coins to {user}!\n\nYour Balance: {current_balance} coins\n{user} Balance: {user_balance} coins",

		CASES: {
			BRONZE: "Bronze Case",
			SILVER: "Silver Case",
			GOLD: "Gold Case",

			CHOOSE_TEXT: "To continue, choose one of three availiable cases!",
			NOTE: "You have 30 seconds to choose case!",
			PRIZE_TEXT: "You openned {case} and won {prize} coins!",
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
			TEXT: "Solve the Captcha to Earn {reward} coins!\nYou have 15 seconds!",
			WRONG_ANSWER: "Your answer was incorrect, the game is ended!",
			CORRECT_ANSWER:
				"Your answer was correct, You got {coins} coins to Your Balance!",
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

			WELCOME:
				"Welcome to the Phasmophobia in Discord!\nIn this game you will get ghost type and you need to choose correct evidences for this ghost!\n\nIf you choose correct evidence - you will get 500 coins.\nIf not - ghost will eat you :3\nYou have 30 seconds to choose!\n\nLet's start! Your ghost type is {type}, choose correct evidences to win!",
			WIN: "Congratulations!\nYou won this game and got 500 coins into your Balance!",
			DEFEAT: "You're lost!\nYou lose this game and ghost eat you :3!\nCorrect Evidences: {correct}",
			TIMEOUT: "Time is over, ghost eat you :3!",
		},

		RPS: {
			ITEMS: {
				ROCK: "Rock",
				PAPER: "Paper",
				SCISSORS: "Scissors",
			},

			WAITING_FOR_OPPONENT: "Waiting for {opponent}...",
			FOOTER: "Game: Rock-Paper-Scissors",
			ACCEPT_CHALLENGE:
				"Hey, {opponent}!\n{author} invited you to play Rock-Paper-Scissors!",
			VERSUS: "{opponent} VS {author}",
			TIMEOUT: "Game is ended!\nOne of players didn't make a move!",
			FINAL: (winner) =>
				`Winner of this game is ${winner}, congratulations!`,
			DRAW: "Draw, congratulations!",
			NO_ANSWER: `{opponent} hasn't responded to your offer to play!`,
			DECLINED: `{opponent} refused to play with you!`,
		},

		GUESS_THE_FLAG: {
			DESCRIPTION: "Guess the Flag to earn {reward} coins!",
			WIN: "Congratulations, you won this game!\n\n› Name: {name} ({official_name})\n› Currency: {currency}\n› Languages: {languages}",
			DEFEAT: "Wrong answer!\n\n› Name: {name} ({official_name})\n› Currency: {currency}\n› Languages: {languages}",
			TIMEOUT:
				"Time is out!\n\n› Name: {name} ({official_name})\n› Currency: {currency}\n› Languages: {languages}",
			FOOTER: "Game: Guess the Flag",
		},

		GUESS_THE_LOGO: {
			DESCRIPTION:
				"Guess the Flag to earn {reward} coins!\n\n› Clue: {clue}\n› Hint: {hint}",
			WIN: "Congratulations, you won this game!\n\n› Brand: {brand}\n› Wiki: {wiki}",
			DEFEAT: "Wrong answer!\n\n› Brand: {brand}\n› Wiki: {wiki}",
			TIMEOUT: "Time is out!\n\n› Brand: {brand}\n› Wiki: {wiki}",
			FOOTER: "Game: Guess the Logo",
		},
	},

	LEVELING: {
		ADDED_LEVEL: "Successfully added {level} level(s) to {target}!",
		ADDED_XP: "Successfully added {xp} XP to {target}!",
	},

	MODERATION: {
		BANNED: "Successfully banned {target}!\nReason: {reason}\nModerator: {moderator}",
		KICKED: "Successfully kicked {target}!\nReason: {reason}\nModerator: {moderator}",
		MUTED: "Successfully muted {target}!\nReason: {reason}\nModerator: {moderator}",
		CLEARED: "Successfully deleted {amount} messages!",
		TEMPMUTED:
			"Successfully temporary muted {target}!\nTime: {time}\nReason: {reason}\nModerator: {moderator}",
		UNMUTED: "Successfully unmuted {target}!",
		UNWARNED: "Successfully deleted last warn from {target}!",
		WARNED: "Successfully warned {target}!\nReason: {reason}\nModerator: {moderator}",
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
			TEXT: (url) => `Recently, the bot's source code is available in my repository on GitHub: ${url}`
		}
	},

	SLASH_COMMANDS: {
		ACTIVITY: {
			INVITE: "Here's Your Invite: {url}",
		},
	},

	SETTINGS: {
		CONFIG: {
			TYPES: {
				LANGUAGE: "Guild Language",
				MEMBERS_CHANNEL: "Members Channel¹",
				LOG_CHANNEL: "Log Channel",
				LEVELS_CHANNEL: "Levels Channel",
				TWITCH_CHANNEL: "Twitch Notifications Channel",
				STARBOARD_CHANNEL: "Starboard Channel",
				AUTO_ROLE: "Auto Role",
				MUTE_ROLE: "Mute Role",
				DJ_ROLES: "DJ Roles",
				ANTISPAM: "Anti-Spam",
				ANTILINK: "Anti-Link",
				ANTIINVITE: "Anti-Invite",
				TWITCH_ENABLED: "Twitch System",
				TWITCH_STREAMERS: "Twitch Streamers",
				PREFIX: "Prefix",
			},

			WIKI: "¹ - This channel is intended for Notifications about Participants (their joins and leaves from the server)",
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

	ERRORS: {
		NO_ACCESS: "You have not access to use this command!",
		MEMBER_MISSINGPERMS:
			"You don't have the following Permissions for this command: {perms}",
		BOT_MISSINGPERMS:
			"I don't have the following Permissions for this command: {perms}",
		ARGS_MISSING:
			'You missed an important argument!\nUse the "help {cmd_name}" command to get a usage example!',
		EVAL_CANCELED:
			"The code processing process was canceled ahead of time, as the response may contain personal information!",
		GUILD_NOT_FOUND: 'Guild with ID "{id}" isn\'t found!',
		IS_NAN: '"{input}" is not a Number!',
		USER_BOT: "{target} is a Bot!",
		NOT_ENOUGH_MONEY: (action) => `You have not enough coins to ${action}`,
		MEMBER_NOT_BANNABLE:
			"Cannot ban {target} because he has Immunity for this!",
		MEMBER_NOT_KICKABLE:
			"Cannot kick {target} because he has Immunity for this!",
		NO_MUTEROLE: "To use this command, Server must have a Mute Role!",
		CLEAR_LIMIT: "Bot can delete a maximum of 100 messages per use!",
		NO_MUTE: "{member} has not any type of active mute!",
		NO_WARNS: "{member} has not any warns!",
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
	},

	FUNCTIONS: {
		TRIMARRAY: "{len} more...",

		VERIFICATION: {
			ACCEPT: "Accept",
			DECLINE: "Decline",
			TEXT: "To complete, you need to confirm that you did not mix up anything.\nClick on the green button to continue or click on the red button to cancel the action!",
		},
	},

	TWITCH_HANDLER: {
		NEW_STREAM: "New Stream Started on Twitch!",
		STREAM_TITLE: "Stream Title",
		STARTED_AT: "Started At",
		GO_TO: "Go to the Stream",
	},

	PERMISSIONS: {
		MANAGE_GUILD: "Manage Guild (Server)",
		MANAGE_ROLES: "Manage Roles",
		MANAGE_WEBHOOKS: "Manage Webhooks",
		MANAGE_EMOJIS: "Manage Emojis",
		MANAGE_MESSAGES: "Manage Messages",
		ADMINISTRATOR: "Administrator",
		BAN_MEMBERS: "Ban Member",
		KICK_MEMBERS: "Kick Members",
		CREATE_INSANT_INVITE: "Create Instant Invite",
		EMBED_LINKS: "Embed Links",
		SPEAK: "Speak",
		CONNECT: "Connect",
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
		STARBOARDS: {
			CLICK_HERE: "Jump to the Message",
			NEW_STAR: "New Star Message!",
			MSG_ATTACH: "Attachments",
		},

		DJ_ROLES: {
			HASNT_ANY: "You can't use this command because You don't have any DJ Role!"
		},
	},

	EVENTS: {
		GUILD_PREFIX: 'Prefix for "{guild}": `{prefix}`',

		GUILD_BIRTHDAY: {
			text: '"{name}" are celebrating their birthday today! This server is already {years} {check} old!',
			YEAR: "year",
			YEARS: "years",
		},

		GUILD_EVENTS: {
			//guildMemberAdd | guildMemberRemove
			MEMBER_ADD: "⬆️ | New Member on the Server!",
			MEMBER_REMOVE: "⬇️ | Member left this Server!",

			//guildMemberBoost | guildMemberUnboost
			MEMBER_BOOST: {
				TITLE: "🎉 | Member boosted this Server!",
				DESCRIPTION:
					"{member} just boosted this server!\nServer Boosts: {boosts}",
			},
			MEMBER_UNBOOST: {
				TITLE: "😔 | Member unboosted this Server!",
				DESCRIPTION:
					"{member} just unboosted this server!\nServer Boosts: {boosts}",
			},

			//guildMemberRoleAdd | guildMemberRoleRemove
			ROLE_ADD: {
				TITLE: "⬆️ | Member Got a Role!",
				DESCRIPTION:
					"{member} just got a {role} role!\nModerator: {moderator}",
			},
			ROLE_REMOVE: {
				TITLE: "⬇️ | Member Lost a Role!",
				DESCRIPTION:
					"{member} just lost a {role} role!\nModerator: {moderator}",
			},

			//guildBoostLevelUp | guildBoostLevelDown
			LEVEL_UP: {
				TITLE: "🎉 | Server Boost Level Upped!",
				DESCRIPTION: "This Server just got new {newLevel} boost level!",
			},
			LEVEL_DOWN: {
				TITLE: "😔 | Server Boost Level Downed!",
				DESCRIPTION: "Server boost level downed to {newLevel} level!",
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
				TITLE: "😔 | Server got UnPartnered!",
				DESCRIPTION: 'Server just lost "Verified" Status right now!',
			},
		},

		LEVELING: {
			NEWLEVEL: "🎉 | {user} has raised it's level to {level}",
		},

		MESSAGE_EVENTS: {
			DELETE: {
				TITLE: "🗑️ | Message Deleted!",
				DESCRIPTION: "Message from {author} has been deleted!\n\n› Message Content: `{content}`\n› Deleted at: {date}",

				GHOST_PING: {
					TITLE: "⚠️ | Ghost Ping Detected",
					DESCRIPTION: "Looks like that message from {author} has member mentions!\n\n› Message Content: `{content}`",
				}
			},
			UPDATE: {
				TITLE: "⬆️ | Message Updated!",
				DESCRIPTION: "Message from {author} has been updated!\n\n› Old Message Content: `{oldContent}`\n› New Message Content: `{newContent}`\n› Changed at: {date}",
				GO_TO: "Jump to Message",
			},
		},

		MODERATION: {
			MUTE_TYPES: {
				DEFAULT: "Default",
				TEMPORARY: "Temporary",
			},

			MUTE_MEMBER: {
				TYPE: "Type",
				MEMBER: "Member",
				MODERATOR: "Moderator",
				CHANNEL: "Channel",
				REASON: "Reason",
				TIME: "Time",
				UNMUTING_AT: "Unmuting At",

				DEFAULT_TITLE: "New Mute!",
				TEMPORARY_TITLE: "New Temporary Mute!",
			},

			UNMUTE_MEMBER: {
				TYPE: "Type",
				MEMBER: "Member",
				MODERATOR: "Moderator",
				CHANNEL: "Channel",
				REASON: "Reason",
				TIME: "Time",

				DEFAULT_TITLE: "End of Mute!",
				TEMPORARY_TITLE: "End of Temporary Mute!",
			},

			WARN_ADD: {
				MEMBER: "Member",
				MODERATOR: "Moderator",
				CHANNEL: "Channel",
				REASON: "Reason",
				WARNS: "Warns",
				TITLE: "Warn Added!",
			},

			WARN_REMOVE: {
				MEMBER: "Member",
				MODERATOR: "Moderator",
				CHANNEL: "Channel",
				REASON: "Reason",
				WARNS: "Warns",
				TITLE: "Warn Removed!",
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

		CHANNEL_EVENTS: {
			CHANNEL_TYPES: {
				TEXT: "Text Channel",
				VOICE: "Voice Channel",
				CATEGORY: "Category",
				NEWS: "News Channel",
				STORE: "Store Channel",
				NEWS_THREAD: "News Thread",
				PUBLIC_THREAD: "Public Thread",
				PRIVATE_THREAD: "Private Thread",
				STAGE: "Stage Channel",
			},

			CREATE: {
				TITLE: "🆕 | New Channel",
				TYPE: "Type",
				CHANNEL: "Channel",
				MODERATOR: "Moderator",
				DATE: "Created At",
			},

			DELETE: {
				TITLE: "⬇️ | Channel Deleted",
				TYPE: "Type",
				CHANNEL: "Channel",
				MODERATOR: "Moderator",
				DATE: "Deleted At",
			},
		},
	},
};
