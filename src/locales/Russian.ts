const Russian: typeof import("@locales/English").default = {
	BOTOWNER: {
		LEFT_GUILD: 'Успешно покинул сервер с ID "{id}"',
		UPDATED_DB: "Успешно обновил Базу Данных Серверов!",
		COMMAND_RELOADED: (name) =>
			`Команда с названием "${name}" успешно перезагружена!`,
	},

	ECONOMY: {
		COINS: "Коины",
		BALANCE: "Баланс",
		BANK: "Банк",
		TIME_ERROR:
			"Вы уже получили свою награду!\nПопробуйте ещё раз через {time}",
		DAILY_REWARD: "Вы получили Ежедневные {{coins}} Коинов!",
		WORK_REWARD: "Вы получили {coins}} Коинов за работу!",
		WEEKLY_REWARD: "Вы получили Еженедельные {{coins}} Коинов!",
		BALANCE_ADDED: "Успешно добавлено {amount} Коинов на баланс {member}!",
		BALANCE_SUBT: "Успешно убрано {amount} Коинов с баланса {member}!",
		BANK_DEPOSITED: "Успешно вложено {amount} Коинов в Банк!",
		BANK_WITHDREW: "Успешно снято {amount} Коинов из Банка!",
		BALANCE_INFO: "Баланс: {balance} Коинов,\nБанк: {bank} Коинов.",
		GIFTED: "Успешно передано {amount} Коинов {user}!\n\nВаш Баланс: {current_balance} Коинов\nБаланс {user}: {user_balance} Коинов",

		CASES: {
			BRONZE: "Бронзовый Кейс",
			SILVER: "Серебряный Кейс",
			GOLD: "Золотой Кейс",

			CHOOSE_TEXT:
				"Для продолжения, выберите один из предложенных кейсов!",
			NOTE: "У вас есть 30 секунд на выбор!",
			PRIZE_TEXT: "Вы открыли {case} и выйграли {prize} монет!",
			TIME_IS_OVER: "Время вышло!",
		},
	},

	ECONOMY_ACTIONS: {
		DEPOSIT: "вложения их в Банк",
		WITHDRAW: "снятия из банка",
		BUY_CASE: "покупки кейса",
		GIFT: "подарка",
	},

	GAMES: {
		CAPTCHA: {
			TEXT: "Разгадайте Капчу, чтобы получить {reward} Коинов!\nУ вас есть 15 секунд!",
			WRONG_ANSWER: "Ваш ответ оказался ложным, игра закончена!",
			CORRECT_ANSWER:
				"Ваш ответ оказался верным, вы получили {coins} Коинов на ваш Баланс!",
			TIMEOUT: "Время вышло, игра закончена!",
		},

		PHASMOPHOBIA: {
			GHOSTS: {
				BANSHEE: "Банши",
				GORYO: "Горё",
				DEMON: "Демон",
				JINN: "Джинн",
				SPIRIT: "Дух",
				SHADE: "Тень",
				PHANTOM: "Фантом",
				HANTU: "Ханту",
				MARE: "Мара",
				WRAITH: "Мираж",
				REVENANT: "Ревенант",
				RAIJU: "Райдзю",
				THE_TWINS: "Близнецы",
				POLTERGEIST: "Полтергейст",
				MYLING: "Мюлинг",
				MIMIC: "Мимик",
				YUREI: "Юрей",
				YOKAI: "Ёкай",
				ONI: "Они",
				ONRYO: "Онрё",
				OBAKE: "Обакэ",
			},

			EVIDENCES: {
				EMF: "ЭМП-5",
				DOTS: "Лазер. Проектор",
				ORBS: "Огонёк",
				FINGERPRINTS: "Следы рук",
				WRITING: "Надписи",
				FREEZING: "Минусовая",
				SPIRIT_BOX: "Радиоприёмник",
			},

			WELCOME:
				"Добро пожаловать в игру Phasmophobia в Discord!\nВ данной игре вы получите тип призрака, и вам нужно выбрать правильные доказательства для данного призрака!\n\nЕсли вы выберете правильные доказательства - получите 500 монет.\nЕсли нет - призрак съест вас :3\nУ вас есть 30 секунд для выбора!\n\nПриступим! Ваш тип призрака - {type}, выберите правильные доказательства для победы!",
			WIN: "Поздравляем!\nВы победили данную игру и получили 500 коинов на ваш баланс!",
			DEFEAT: "Вы проиграли!\nВы проиграли данную игру и призрак съел вас :3!\nПравильные доказательства: {correct}",
			TIMEOUT: "Время вышло, призрак съел вас :3!",
		},

		RPS: {
			ITEMS: {
				ROCK: "Камень",
				PAPER: "Бумага",
				SCISSORS: "Ножницы",
			},

			WAITING_FOR_OPPONENT: "Ожидаем {opponent}...",
			FOOTER: "Игра: Камень-Ножницы-Бумага",
			ACCEPT_CHALLENGE:
				"Эй, {opponent}!\n{author} пригласил вас поиграть в Камень-Ножницы-Бумага!",
			VERSUS: "{opponent} VS {author}",
			TIMEOUT: "Игра окончена!\nОдин из игроков не сделал ход!",
			FINAL: (winner) =>
				`Победитель данной игры - ${winner}, поздравляем!`,
			DRAW: "Ничья, поздравляем!",
			NO_ANSWER: `{opponent} не ответил на ваше предложение сыграть!`,
			DECLINED: `{opponent} отказался поиграть с вами!`,
		},

		GUESS_THE_FLAG: {
			DESCRIPTION: "Угадайте флаг чтобы получить {reward} коинов!",
			WIN: "Поздравляем, вы выйграли эту игру!\n\n› Название: {name} ({official_name})\n› Валюты: {currency}\n› Языки: {languages}",
			DEFEAT: "Неверный ответ!\n\n› Название: {name} ({official_name})\n› Валюты: {currency}\n› Языки: {languages}",
			TIMEOUT:
				"Время вышло!\n\n› Название: {name} ({official_name})\n› Валюты: {currency}\n› Языки: {languages}",
			FOOTER: "Игра: Угадайте Флаг",
		},

		GUESS_THE_LOGO: {
			DESCRIPTION:
				"Угадайте Логотип чтобы получить {reward} коинов!\n\n› Зацепка: {clue}\n› Подсказка: {hint}",
			WIN: "Поздравляю, вы выйграли эту игру!\n\n› Бренд: {brand}\n› Вики: {wiki}",
			DEFEAT: "Неверный ответ!\n\n› Бренд: {brand}\n› Вики: {wiki}",
			TIMEOUT: "Время вышло!\n\n› Бренд: {brand}\n› Вики: {wiki}",
			FOOTER: "Игра: Угадай Логотип",
		},
	},

	LEVELING: {
		ADDED_LEVEL: "Успешно выдал {level} уровень(-ей) {target}!",
		ADDED_XP: "Успешно выдал {xp} XP {target}!",
	},

	MODERATION: {
		BANNED: "Успешно забанил {target}!\nПричина: {reason}\nМодератор: {moderator}",
		KICKED: "Успешно выгнал {target}!\nПричина: {reason}\nМодератор: {moderator}",
		MUTED: "Успешно замутил {target}!\nПричина: {reason}\nМодератор: {moderator}",
		CLEARED: "Успешно удалил {amount} сообщений!",
		TEMPMUTED:
			"Успешно Временно Замутил {target}!\nВремя: {time}\nПричина: {reason}\nМодератор: {moderator}",
		UNMUTED: "Успешно размутил {target}!",
		UNWARNED: "Успешно удалил последнее предупреждение у {target}!",
		WARNED: "Успешно предупредил {target}!\nПричина: {reason}\nМодератор: {moderator}",
		EMOJI_CREATED: (name) =>
			`Эмодзи с названием "${name}" успешно создано на сервере!`,
	},

	MUSIC: {
		LOOP_MODES: {
			OFF: "Выключен",
			SONG: "Песня",
			QUEUE: "Очередь",
		},
		LOOP_CHANGES: (mode) => `Режим повтора поставлен на ${mode}`,

		NOW_PLAYING: (name) => `Сейчас играет - \`${name}\``,
		SONG_INFO: {
			NAME: "Название Песни",
			URL: "Ссылка на Песню",
			VIEWS: "Кол-во Просмотров",
			DURATION: "Длина Песни",
			REQUESTED_BY: "Запросил",
		},

		PAUSED: "Текущая песня приостановлена!",
		QUEUE: "Текущая Серверная Очередь",
		RESUMED: "Текущая песня возобновлена!",
		SHUFFLED: "Текущая Серверная Очередь перемешана!",
		SKIPPED: "Текущая песня пропущена!",
		STOPPED: "Текущая Серверная Очередь остановлена!",

		VOLUME_NOW: (volume) => `Текущая громкость песни - ${volume}%`,
		VOLUME_SETTED: (volume) =>
			`Текущая громкость песни изменена на ${volume}%`,
	},

	OTHER: {
		BOTINFO: {
			TITLE: "Статистика",
			GUILDS: "Серверов",
			USERS: "Пользователей",
			EMOJIS: "Эмодзи",
			CHANNELS: "Каналов",
			EVENTS: "Событий",
			COMMANDS: "Команд",
			UPTIME: "Время работы",
			STARTED_AT: "Дата Запуска",
			API_PING: "Пинг API",
			BOT_VERSION: "Версия Бота",
			FIELD_NAME: "О боте",
		},

		HELP: {
			CATEGORIES: {
				BOT_OWNER: "Владелец Бота",
				ECONOMY: "Экономика",
				FUN: "Развлечения",
				MODERATION: "Модерация",
				MUSIC: "Музыка",
				OTHER: "Другие",
				SETTINGS: "Настройки",
				GAMES: "Игры",
				LEVELING: "Уровни",
			},

			COMMAND: {
				NAME: "Название",
				DESCRIPTION: "Описание",
				ALIASES: "Алиасы",
				USAGE: "Использование",
				CATEGORY: "Категория",
				BOT_PERMISSIONS: "Права для Бота",
				MEMBER_PERMISSIONS: "Права для Участника",
			},

			COMMANDS_LENGTH: "Команд",
		},

		SERVER_INFO: {
			TITLE: "Информация Сервера",

			FIELDS: {
				FIRST: "Статусы Пользователей",
				SECOND: "Участники",
				THIRD: "Каналы",
			},

			STATUSES: {
				ONLINE: "Онлайн",
				IDLE: "Не активен",
				DND: "Не беспокоить",
			},

			MEMBER_TYPES: {
				HUMANS: "Люди",
				BOTS: "Боты",
			},

			CHANNELS: {
				TEXT: "Текстовые",
				NEWS: "Новостные",
				VOICE: "Голосовые",
				STAGE: "Трибуны",
				CATEGORIES: "Категории",
			},

			OTHER: {
				GUILD_ID: "ID Сервера",
				OWNER: "Владелец",
				MEMBER_COUNT: "Участников",
			},
		},

		USER_INFO: {
			CLIENT_STATUSES: {
				WEB: "Браузер",
				DESKTOP: "Приложение",
				MOBILE: "Телефон",
			},

			OTHER: {
				NOT_PLAYING: "Не играет",
				NOTHING: "Ничего",
			},

			FIELDS: {
				MAIN: "Главное",
				OTHER: "Другое",
			},

			TEXTS: {
				MAIN: {
					USERNAME: "Имя пользователя",
					TAG: "Тег",
					AVATAR: "Аватар",
				},

				OTHER: {
					ONLINE_USING: "Онлайн через",
					PRESENCE: "Статус",
					PLAYING: "Играет в",
					REG_DATE: "Дата Регистрации",
					JOIN_DATE: "Дата Входа",
					IN_VOICE: "В Голосовом Канале",
					BOOSTING: "Бустит",
					BOT: "Бот",
				},
			},
		},

		SOURCE: {
			TEXT: (url) =>
				`С недавних пор, исходный код бота доступен в моём репозитории на GitHub: ${url}`,
		},
	},

	SLASH_COMMANDS: {
		ACTIVITY: {
			INVITE: "Вот ваше приглашение: {url}",
		},
	},

	SETTINGS: {
		CONFIG: {
			TYPES: {
				CUSTOM_COMMANDS: "Кастом Команды",
				LANGUAGE: "Язык Сервера",
				MEMBERS_CHANNEL: "Канал для Участников",
				LOG_CHANNEL: "Канал для Логов",
				LEVELS_CHANNEL: "Канал для Уровней",
				TWITCH_CHANNEL: "Канал для Twitch Оповещений",
				STARBOARD_CHANNEL: "Звёздный Канал",
				AUTO_ROLE: "Авто Роль",
				MUTE_ROLE: "Мут Роль",
				DJ_ROLES: "DJ Роли",
				ANTISPAM: "Анти-Спам",
				ANTILINK: "Анти-Ссылка",
				ANTIINVITE: "Анти-Приглашение",
				TWITCH_SYSTEM: "Twitch Оповещения",
				TWITCH_STREAMERS: "Twitch Стримеры",
				PREFIX: "Префикс",
			},
		},

		SETTED: (type, value) => `Успешно изменил "${type}" на "${value}"`,
		RESETTED: (type, value?) =>
			`Успешно сбросил "${type}" на изначальное значение${
				value !== undefined ? ` (${value})` : ""
			}`,
		ADDED: (type, value) => `Успешно добавил "${value}" в "${type}"`,
		DELETED: (type, value) => `Успешно удалил "${value}" из "${type}"`,
		ENABLED: (type) => `Успешно включил "${type}"`,
		DISABLED: (type) => `Успешно выключил "${type}"`,
		SHOW: (type, value) => `"${type}" Сервера - ${value}`,

		LANGUAGE_CHANGED_NOTE:
			"Если вы сделали это по-случайности, используйте команду 'language-reset'",
	},

	ERRORS: {
		NO_ACCESS: "У вас нет доступа к данной команде!",
		MEMBER_MISSINGPERMS:
			"Вы не имеете следующие права для запуска команды: {perms}",
		BOT_MISSINGPERMS:
			"У меня нет следующих прав для запуска команды: {perms}",
		ARGS_MISSING:
			'Вы упустили важный аргумент!\nВоспользуйтесь командой "help {cmd_name}" для получения примера использования!',
		EVAL_CANCELED:
			"Процесс обработки кода досрочно отменён, так как ответ может содержать личную информацию!",
		GUILD_NOT_FOUND: 'Сервер с ID "{id}" не найден!',
		IS_NAN: '"{input}" не является числом!',
		USER_BOT: "{target} - бот!",
		NOT_ENOUGH_MONEY: (action) => `У вас недостаточно Коинов для ${action}`,
		MEMBER_NOT_BANNABLE:
			"Не могу забанить {target} потому, что Участник имеет Иммунитет от этого!",
		MEMBER_NOT_KICKABLE:
			"Не могу кикнуть {target} потому, что Участник имеет Иммунитет от этого!",
		NO_MUTEROLE:
			"Для использования команды, серверу необходимо иметь Мут Роль!",
		CLEAR_LIMIT:
			"Бот может удалять максимум 100 сообщений за использование!",
		NO_MUTE: "{member} не имеет активного мута!",
		NO_WARNS: "{member} не имеет предупреждений!",
		NOT_JOINED_VOICE:
			"Для использования командой, вам необходимо зайти в Голосовой Канал!",
		JOIN_BOT_VOICE:
			"Для использования командой, вам необходимо зайти в Голосовой Канал со мной!",
		QUEUE_EMPTY: "Серверная очередь пустая!",
		PAUSED: "Текующая Песня уже приостановлена!",
		RESUMED: "Текующая Песня уже возобновлена!",
		MISSING_IN_DB: (type) => `Значение "${type}" отсутствует в базе!`,
		CANNOT_BE_EVERYONE: (type) => `"${type}" не может быть everyone!`,
		SYSTEM_NOT_ENABLED: (type) => `"${type}" не включена!`,
		SYSTEM_ENABLED: (type) => `"${type}" включена!`,
		MISSING_IN_LIST: (value, list) =>
			`"${value}" не найден в списке!\nВыборы: ${list}`,
		CHANNEL_TYPE: "Тип канала не Текстовый или Новостной!",
		COMMAND_NOT_FOUND: (name) =>
			`Команда с названием "${name}" не найдена!`,
		BALANCE_BOTS: "Боты не могут иметь баланс!",
		GIFT_YOURSELF: "Вы не можете подарить монеты самому себе!",
		NOT_FOUND: (src) => `Your query is not found in ${src}!`,
		NOT_FOUND_IN_DB: (type, value) =>
			`"${value}" не найден в списке "${type}"!`,
		ALREADY_IN_DB: (type, value) => `"${value}" уже находится "${type}"`,
		EMOJIS_LIMIT: "Достигнут лимит количества эмодзи на сервере!",
		VALID_EMOJI: "Пожалуйста, укажите корректное эмодзи!",
		NORMAL_EMOJI:
			"Вы можете использовать обычные эмодзи без добавления на сервер!",
	},

	FUNCTIONS: {
		TRIMARRAY: "+{len} элементов...",

		VERIFICATION: {
			ACCEPT: "Подтвердить",
			DECLINE: "Отклонить",
			TEXT: "Для завершения вам нужно подтвердить то, что вы ничего не перепутали.\nНажмите на зелёную кнопку, чтобы продолжить или нажмите на красную кнопку, чтобы отменить действие!",
		},
	},

	TWITCH_HANDLER: {
		NEW_STREAM: "Новая трансляция на Twitch!",
		STREAM_TITLE: "Название трансляции",
		STARTED_AT: "Дата запуска",
		GO_TO: "Перейти",
	},

	PERMISSIONS: {
		MANAGE_GUILD: "Управлять Сервером",
		MANAGE_ROLES: "Управлять Ролями",
		MANAGE_WEBHOOKS: "Управлять Вебхуками",
		MANAGE_EMOJIS_AND_STICKERS: "Управлять Эмоджи и Стикерами",
		MANAGE_MESSAGES: "Управлять Сообщениями",
		ADMINISTRATOR: "Администратор",
		BAN_MEMBERS: "Бан Участников",
		KICK_MEMBERS: "Кик Участников",
		CREATE_INSANT_INVITE: "Создавать Приглашения",
		EMBED_LINKS: "Embed Сообщения",
		SPEAK: "Говорить",
		CONNECT: "Подключаться",
	},

	GLOBAL: {
		BOT: "Бот",
		YES: "Да",
		NO: "Нет",
		DAYJS_FORMAT: "D [дн,] H [час,] mm [мин,] ss [сек]",
		ENABLED: "Включена",
		DISABLED: "Выключена",
		ACCEPT: "Принять",
		DECLINE: "Отклонить",
		NONE: "Отсутствуют",

		STATUSES: {
			ONLINE: "Онлайн",
			IDLE: "Не активен",
			DND: "Не беспокоить",
			OFFLINE: "Оффлайн",
		},
	},

	SYSTEMS: {
		STARBOARDS: {
			CLICK_HERE: "Перейти к сообщению",
			NEW_STAR: "Новое Звёздное Сообщение!",
			MSG_ATTACH: "Приложенные файлы",
		},

		DJ_ROLES: {
			HASNT_ANY:
				"Вы не можете использовать данную команду так как у вас нету DJ роли!",
		},
	},

	EVENTS: {
		GUILD_PREFIX: 'Префикс на "{guild}": `{prefix}`',

		GUILD_BIRTHDAY: {
			text: '"{name}" сегодня празднует свой День Рождения! Данному серверу уже {years} {check}!',
			YEAR: "год",
			YEARS: "лет",
		},

		GUILD_EVENTS: {
			//guildMemberAdd | guildMemberRemove
			MEMBER_ADD: "⬆️ | Новый участник на сервере!",
			MEMBER_REMOVE: "⬇️ | Участник вышел с сервера!",

			//guildMemberBoost | guildMemberUnboost
			MEMBER_BOOST: {
				TITLE: "🎉 | Участник бустанул сервер!",
				DESCRIPTION: "{member} бустанул этот сервер!\nБустов: {boosts}",
			},
			MEMBER_UNBOOST: {
				TITLE: "😔 | Участник убрал буст!",
				DESCRIPTION: "{member} убрал буст с сервера!\nБустов: {boosts}",
			},

			//guildMemberRoleAdd | guildMemberRoleRemove
			ROLE_ADD: {
				TITLE: "⬆️ | Участник получил роль!",
				DESCRIPTION:
					"{member} получил роль {role}!\nМодератор: {moderator}",
			},
			ROLE_REMOVE: {
				TITLE: "⬇️ | Участник лишился роли!",
				DESCRIPTION:
					"{member} лишился роли {role}!\nМодератор: {moderator}",
			},

			//guildBoostLevelUp | guildBoostLevelDown
			LEVEL_UP: {
				TITLE: "🎉 | Уровень сервера повышен!",
				DESCRIPTION: "Сервер получил новый {newLevel} уровень буста!",
			},
			LEVEL_DOWN: {
				TITLE: "😔 | Уровень сервера понижен!",
				DESCRIPTION: "Уровень сервера понижен до {newLevel}!",
			},

			//guildPartnerAdd | guildPartnerRemove
			PARTNERED: {
				TITLE: "🎉 | Сервер получил Партнёрку!",
				DESCRIPTION: 'Сервер только что получил статус "Партнёрский"!',
			},
			UNPARTNERED: {
				TITLE: "😔 | Сервер потерял Партнёрку!",
				DESCRIPTION: 'Сервер только что потерял статус "Партнёрский"!',
			},

			//guildVerificationAdd | guildVerificationRemove
			VERIFIED: {
				TITLE: "🎉 | Сервер получил Верификацию!",
				DESCRIPTION:
					'Сервер только что получил статус "Верифицированный"!',
			},
			UNVERIFIED: {
				TITLE: "😔 | Server got UnPartnered!",
				DESCRIPTION:
					'Сервер только что потерял статус "Верифицированный"!',
			},
		},

		LEVELING: {
			NEWLEVEL: "🎉 | {user} повысил свой уровень до {level}",
		},

		MESSAGE_EVENTS: {
			DELETE: {
				TITLE: "🗑️ | Удалено сообщение!",
				DESCRIPTION:
					"Сообщение от {author} было удалено!\n\n› Содержание сообщения: `{content}`\n› Дата удаления: {date}",

				GHOST_PING: {
					TITLE: "⚠️ | Обнаружено Упоминание",
					DESCRIPTION:
						"Похоже, что сообщение от {author} имеет упоминания!\n\n› Содержание сообщения: `{content}`",
				},
			},
			UPDATE: {
				TITLE: "⬆️ | Сообщение изменено!",
				DESCRIPTION:
					"Сообщение от {author} было изменено!\n\n› Содержание до: `{oldContent}`\n› Содержание после: `{newContent}`\n› Дата изменения: {date}",
				GO_TO: "Перейти к сообщению",
			},
		},

		MODERATION: {
			MUTE_TYPES: {
				DEFAULT: "Стандартый",
				TEMPORARY: "Временный",
			},

			MUTE_MEMBER: {
				TYPE: "Тип",
				MEMBER: "Участник",
				MODERATOR: "Модератор",
				CHANNEL: "Канал",
				REASON: "Причина",
				TIME: "Время",
				UNMUTING_AT: "Дата размута",

				DEFAULT_TITLE: "Новый Мут!",
				TEMPORARY_TITLE: "Новый Временный Мут!",
			},

			UNMUTE_MEMBER: {
				TYPE: "Тип",
				MEMBER: "Участник",
				MODERATOR: "Модератор",
				CHANNEL: "Канал",
				REASON: "Причина",
				TIME: "Время",

				DEFAULT_TITLE: "Конец Мута!",
				TEMPORARY_TITLE: "Конец Временного Мута!",
			},

			WARN_ADD: {
				MEMBER: "Участник",
				MODERATOR: "Модератор",
				CHANNEL: "Канал",
				REASON: "Причина",
				WARNS: "Предупреждений",
				TITLE: "Новое Предупреждение!",
			},

			WARN_REMOVE: {
				MEMBER: "Участник",
				MODERATOR: "Модератор",
				CHANNEL: "Канал",
				REASON: "Причина",
				WARNS: "Предупреждений",
				TITLE: "Удалено Предупреждение!",
			},
		},

		MUSIC_EVENTS: {
			ADD_SONG: {
				EMBED_TITLE: "🎶 | Песня добавлена в очередь",
				TITLE: "Название",
				URL: "Ссылка",
				VIEWS: "Просмотров",
				DURATION: "Длина",
				SONGS: "Песен в Очереди",
				REQUESTED_BY: "Запросил",
			},

			PLAY_SONG: {
				EMBED_TITLE: "🎶 | Играю песню из очереди",
				TITLE: "Название",
				URL: "Ссылка",
				VIEWS: "Просмотров",
				DURATION: "Длина",
				SONGS: "Песен в Очереди",
				REQUESTED_BY: "Запросил",
			},

			ADD_LIST: {
				EMBED_TITLE: "🎶 | Добавляю плейлист в очередь",
				TITLE: "Название Плейлиста",
				URL: "Ссылка на Плейлиста",
				VIEWS: "Просмотров",
				DURATION: "Длина",
				PLAYLIST_SONGS: "Песен в плейлисте",
				SONGS: "Песен в очереди",
				REQUESTED_BY: "Запросил",
			},

			FINISH: "Музыкальная очередь закончилась, бот покинул Голосовой Канал!",
			EMPTY: "Голосовой Канал пустой, бот покинул Голосовой Канал!",
			ERROR: (message) => `Упс, тут произошла ошибка: ${message}`,
		},

		CHANNEL_EVENTS: {
			CHANNEL_TYPES: {
				TEXT: "Текстовый Канал",
				VOICE: "Голосовой Канал",
				CATEGORY: "Категория",
				NEWS: "Новостной Канал",
				STORE: "Магазин",
				NEWS_THREAD: "Новостная Ветка",
				PUBLIC_THREAD: "Публичная Ветка",
				PRIVATE_THREAD: "Приватная Ветка",
				STAGE: "Трибуна",
			},

			CREATE: {
				TITLE: "🆕 | Новый Канал",
				TYPE: "Тип",
				CHANNEL: "Канал",
				MODERATOR: "Модератор",
				DATE: "Дата создания",
			},

			DELETE: {
				TITLE: "🗑️ | Канал Удалён",
				TYPE: "Тип",
				CHANNEL: "Канал",
				MODERATOR: "Модератор",
				DATE: "Дата удаления",
			},
		},
	},
};

export default Russian;
