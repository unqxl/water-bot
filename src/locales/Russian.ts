import { time as build_time } from "@discordjs/builders";

function declOfNum(n: number, text_forms: string[]) {
	n = Math.abs(n) % 100;
	var n1 = n % 10;

	if (n > 10 && n < 20) {
		return text_forms[2];
	}

	if (n1 > 1 && n1 < 5) {
		return text_forms[1];
	}

	if (n1 == 1) {
		return text_forms[0];
	}

	return text_forms[2];
}

const Russian: typeof import("@locales/English").default = {
	BOTOWNER: {
		LEFT_GUILD: (id) => `Успешно покинул сервер с ID "${id}"`,
		COMMAND_RELOADED: (name) =>
			`Команда с названием "${name}" успешено перезагружена!`,
	},

	ECONOMY: {
		COINS: "Coins",
		BALANCE: "Balance",
		BANK: "Bank",

		TIME_ERROR: (time, unix) => {
			var collectAt = build_time(unix, "R");
			return `Вы уже забрали данную награду!\nПопробуйте ещё раз ${time} (${collectAt})`;
		},

		DAILY_REWARD: (coins) =>
			`Успешно забрали ${coins} коинов в качестве Ежедневной награды!`,
		WORK_REWARD: (coins) =>
			`Успешно забрали ${coins} коинов в качестве награды за работу!`,
		WEEKLY_REWARD: (coins) =>
			`Успешно забрали ${coins} коинов в качестве Еженедельной награды!`,

		BALANCE_ADDED: (amount, member) => {
			var form = declOfNum(Number(amount.replace(" ", "")), [
				"монету",
				"монеты",
				"монет",
			]);

			return `Успешно добавлено ${amount} ${form} на баланс ${member}!`;
		},

		BALANCE_SUBT: (amount, member) => {
			var form = declOfNum(Number(amount.replace(" ", "")), [
				"монету",
				"монеты",
				"монет",
			]);

			return `Успешно убрано ${amount} ${form} с баланса ${member}!`;
		},

		BANK_DEPOSITED: (amount) => {
			var form = declOfNum(Number(amount.replace(" ", "")), [
				"монету",
				"монеты",
				"монет",
			]);

			return `Успешно внесено ${amount} ${form} в ваш банк!`;
		},

		BANK_WITHDREW: (amount) => {
			var form = declOfNum(Number(amount.replace(" ", "")), [
				"монету",
				"монеты",
				"монет",
			]);

			return `Успешно снято ${amount} ${form} с вашего банка!`;
		},

		BALANCE_INFO: (balance, bank) => {
			var [balance_form, bank_form] = [
				declOfNum(Number(balance.replace(" ", "")), [
					"монету",
					"монеты",
					"монет",
				]),

				declOfNum(Number(bank.replace(" ", "")), [
					"монету",
					"монеты",
					"монет",
				]),
			];

			return `Баланс: ${balance} ${balance_form}.\nБаланс в банке: ${bank} ${bank_form}.`;
		},

		GIFTED: (amount, user, balance) => {
			var [amount_form, balance_form] = [
				declOfNum(Number(amount.replace(" ", "")), [
					"монету",
					"монеты",
					"монет",
				]),

				declOfNum(Number(balance.replace(" ", "")), [
					"монету",
					"монеты",
					"монет",
				]),
			];

			return `Успешно подарено ${amount} ${amount_form} ${user}!\nВаш баланс: ${balance} ${balance_form}`;
		},

		CASES: {
			BRONZE: "Бронзовый кейс",
			SILVER: "Серебряный кейс",
			GOLD: "Золотой кейс",

			CHOOSE_TEXT: "Для продолжения, выберите один из доступных кейсов!",
			NOTE: "У вас есть 30 секунд на выбор кейса!",
			PRIZE_TEXT: (case_name, prize) =>
				`Вы открыли ${case_name} и получили ${prize} коинов!`,
			TIME_IS_OVER: "Время вышло!",
		},

		SHOP: {
			ALL: {
				EMPTY: "Магазин сервера сейчас пустой!",
			},

			CREATE: {
				PROMPTS: {
					WRITE_NAME: "Напишите название предмета (15 сек)",
					WRITE_DESCRIPTION: "Напишите описание предмета (30 сек)",
					WRITE_COST: "Напишите цену предмета (15 сек)",
					WRITE_ROLE:
						"Укажите роль для предмета или пропустите это (15 сек)",
				},

				PROMPTS_ERRORS: {
					NAME: "Вы не указали название предмета!",
					DESCRIPTION: "Вы не указали описание предмета!",
					COST: "Вы не указали цену предмета!",
					REGEX_ERROR: "Ваш ответ не похож на упоминание роли!",
				},

				CREATED: (name, cost) => {
					const formatted = Number(cost).toLocaleString("be");
					const format = declOfNum(cost, [
						"монету",
						"монеты",
						"монет",
					]);

					return `Успешно создал предмет с названием "${name}" (${formatted} ${format})`;
				},
			},

			DELETE: {
				PROMPTS: {
					WRITE_ID: (prefix) =>
						`Укажите ID (номер) предмета \`(${prefix}shop all | 15 сек)\``,
				},

				PROMPTS_ERRORS: {
					ID: "Вы не указали ID (номер) предмета!",
					ITEM_NOT_FOUND: (id) =>
						`Предмет с ID (номером) ${id} не найден в списке предметов!`,
				},

				DELETED: (name) => `Успешно удалён предмет "${name}"!`,
			},

			BUY: {
				PROMPTS: {
					WRITE_ID: (prefix) =>
						`Укажите ID (номер) предмета \`(${prefix}shop all | 15 сек)\``,
				},

				PROMPTS_ERRORS: {
					ID: "Вы не указали ID (номер) предмета!",
					ITEM_NOT_FOUND: (id) =>
						`Предмет с ID (номером) ${id} не найден в списке предметов!`,
				},

				PURCHASED: (name) => `Успешно куплен предмет "${name}"!`,
			},
		},
	},

	ECONOMY_ACTIONS: {
		WITHDRAW: "Снятия с банка",
		DEPOSIT: "Вложения в банк",
		BUY_CASE: "Покупки кейса",
		BUY_ITEM: "покупки предмета",
		GIFT: "Перевода",
	},

	GAMES: {
		CAPTCHA: {
			TEXT: (reward) =>
				`Разгадайте капчу, чтобы получить ${reward} коинов!\nУ вас есть 15 секунд!`,
			WRONG_ANSWER: "Ответ оказался неверным, вы проиграли!",
			CORRECT_ANSWER: (coins) =>
				`Ответ оказался верным, Вы получили ${coins} коинов на баланс!`,
			TIMEOUT: "Время вышло, игра окончена!",
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
				YOKAI: "Ёкаё",
				ONI: "Они",
				ONRYO: "Онрё",
				OBAKE: "Обакэ",
			},

			EVIDENCES: {
				EMF: "ЭМП-5",
				DOTS: "Лаз. проектор",
				ORBS: "Призрач. огонёк",
				FINGERPRINTS: "Отпечатки рук",
				WRITING: "Записи в блок.",
				FREEZING: "Минус. темп.",
				SPIRIT_BOX: "Радиоприёмник",
			},

			WELCOME: (type) =>
				`Добро пожаловать в Phasmophobia в Discord!\nВ данной игре Вам необходимо выбрать правильные доказательства для указанного типа призрака!\n\nЕсли вы выбираете правильные доказательства, то получаете 150 коинов.\nЕсли же нет, то призрак съест вас :3\nУ вас есть 30 секунд на выбор!\n\nДавайте приступим! Ваш тип призрака - ${type}, выберите правильные доказательства!`,
			WIN: "Поздравляем!\nВы победили, и получили 150 коинов в качестве приза!",
			DEFEAT: (correct) =>
				`Вы проиграли!\nВы выбрали неверные доказательства, и призрак съел вас :3!\nПравильный доказательства: ${correct}`,
			TIMEOUT: "Время вышло и призрак съел вас :3!",
		},

		RPS: {
			ITEMS: {
				ROCK: "Камень",
				PAPER: "Бумага",
				SCISSORS: "Ножницы",
			},

			WAITING_FOR_OPPONENT: (opponent) => `Ожидаем ${opponent}...`,
			FOOTER: "Игра: Камень, Ножницы, Бумага",
			ACCEPT_CHALLENGE: (opponent, author) =>
				`Привет, ${opponent}!\n${author} пригласил вас в игру Камень, Ножницы, Бумага!`,
			VERSUS: (opponent, author) => `${opponent} против ${author}`,
			TIMEOUT: "Игра окончена!\nОдин из игроков не сделал ход!",
			FINAL: (winner) => `Победитель этой игры - ${winner}, поздравляем!`,
			DRAW: "Ничья, поздравляем!",
			NO_ANSWER: (opponent) =>
				`${opponent} не ответил на ваше предложение!`,
			DECLINED: (opponent) => `${opponent} отказался с вами играть!`,
		},

		GUESS_THE_FLAG: {
			DESCRIPTION: (reward) =>
				`Угадай страну по флагу, чтобы получить ${reward}!`,
			WIN: (name, official_name, currency, languages) =>
				`Поздравляем, вы победили!\n\n› Название: ${name} (${official_name})\n› Валюта(ы): ${currency}\n› Язык(и): ${languages}`,
			DEFEAT: (name, official_name, currency, languages) =>
				`Неправильный ответ!\n\n› Название: ${name} (${official_name})\n› Валюта(ы): ${currency}\n› Язык(и): ${languages}`,
			TIMEOUT: (name, official_name, currency, languages) =>
				`Время вышло!\n\n› Название: ${name} (${official_name})\n› Валюта(ы): ${currency}\n› Язык(и): ${languages}`,
			FOOTER: "Игра: Угадай страну по флагу",
		},

		GUESS_THE_LOGO: {
			DESCRIPTION: (reward, clue, hint) =>
				`Угадай логотип, чтобы получить ${reward} коинов!\n\n› Наводка: ${clue}\n› Подсказка: ${hint}`,
			WIN: (brand, wiki) =>
				`Поздравляем, вы победили!\n\n› Бренд: ${brand}\n› Вики: ${wiki}`,
			DEFEAT: (brand, wiki) =>
				`Неверный ответ!\n\n› Бренд: ${brand}\n› Вики: ${wiki}`,
			TIMEOUT: (brand, wiki) =>
				`Время вышло!\n\n› Бренд: ${brand}\n› Вики: ${wiki}`,
			FOOTER: "Игра: Угадай логотип",
		},
	},

	LEVELING: {
		ADDED_LEVEL: (level, target) =>
			`Успешно добавлено ${level} уровень(-ей) ${target}!`,
		ADDED_XP: (xp, target) => `Успешно добавлено ${xp} XP ${target}!`,
	},

	MODERATION: {
		BANNED: (target, reason, moderator) =>
			`Успешно забанен ${target}!\nПричина: ${reason}\nМодератор: ${moderator}`,
		KICKED: (target, reason, moderator) =>
			`Успешно кикнут ${target}!\nПричина: ${reason}\nМодератор: ${moderator}`,
		MUTED: (target, reason, moderator) =>
			`Успешно замучен ${target}!\nПричина: ${reason}\nМодератор: ${moderator}`,
		CLEARED: (amount) => `Успешно удалил \`${amount}\` сообщений!`,
		TEMPMUTED: (target, time, reason, moderator) =>
			`Успешно временно замучен ${target}!\nВремя: ${time}\nПричина: ${reason}\nМодератор: ${moderator}`,
		UNMUTED: (target) => `Успешно размучен ${target}!`,
		UNWARNED: (target) =>
			`Успешно удалено последнее предупреждение у ${target}!`,
		WARNED: (target, reason, moderator) =>
			`Успешно выдано предупреждение ${target}!\nПричина: ${reason}\nМодератор: ${moderator}`,
		EMOJI_CREATED: (name) =>
			`Эмодзи с названием "${name}" было успешно создано на сервере!`,
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
			NAME: "Название",
			URL: "Ссылка",
			VIEWS: "Просмотров",
			DURATION: "Длина песни",
			REQUESTED_BY: "Запросил",
		},

		PAUSED: "Текущая песня поставлена на паузу!",
		QUEUE: "Очередь сервера",
		RESUMED: "Текущая песня возобновлена!",
		SHUFFLED: "Очередь сервера перемешана!",
		SKIPPED: "Текущая песня пропущена!",
		STOPPED: "Текущая очередь сервера остановлена!",

		VOLUME_NOW: (volume) => `Текущая громкость музыки - \`${volume}%\``,
		VOLUME_SETTED: (volume) =>
			`Текущая громкость музыки повышена до \`${volume}%\``,
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
			STARTED_AT: "Дата запуска",
			API_PING: "Пинг API",
			BOT_VERSION: "Версия бота",
			FIELD_NAME: "Информация бота",
		},

		HELP: {
			CATEGORIES: {
				BOT_OWNER: "Для владельца",
				ECONOMY: "Экономика",
				FUN: "Развлечения",
				MODERATION: "Модерация",
				MUSIC: "Музыка",
				OTHER: "Другие",
				SETTINGS: "Конфигурация",
				GAMES: "Игры",
				LEVELING: "Уровни",
				GIVEAWAYS: "Розыгрыши",
				ROLEPLAY: "Ролевые игры",
				CLANS: "Кланы",
			},

			COMMAND: {
				NAME: "Название",
				DESCRIPTION: "Описание",
				ALIASES: "Алиасы",
				USAGE: "Пример использования",
				CATEGORY: "Категория",
				BOT_PERMISSIONS: "Права для бота",
				MEMBER_PERMISSIONS: "Права для участников",
			},

			COMMANDS_LENGTH: "Команд",
		},

		SERVER_INFO: {
			TITLE: "Информация сервера",

			FIELDS: {
				ZERO: "Информация",
				FIRST: "Статусы",
				SECOND: "Участники",
				THIRD: "Каналы",
			},

			STATUSES: {
				ONLINE: "Онлайн",
				IDLE: "Нет на месте",
				DND: "Не беспокоить",
			},

			MEMBER_TYPES: {
				HUMANS: "Людей",
				BOTS: "Ботов",
			},

			CHANNELS: {
				TEXT: "Текстовых",
				NEWS: "Новостных",
				VOICE: "Голосовых",
				STAGE: "Трибун",
				CATEGORIES: "Категорий",
			},

			OTHER: {
				GUILD_ID: "ID Сервера",
				OWNER: "Владелец",
				MEMBER_COUNT: "Участников",
				CREATED_AT: "Дата создания",
			},
		},

		USER_INFO: {
			CLIENT_STATUSES: {
				WEB: "Браузер",
				DESKTOP: "ПК",
				MOBILE: "Телефон",
			},

			OTHER: {
				NOT_PLAYING: "Не играет",
				NOTHING: "Ничего",
			},

			FIELDS: {
				MAIN: "Основное",
				OTHER: "Другое",
			},

			TEXTS: {
				MAIN: {
					USERNAME: "Ник",
					TAG: "Тег",
					AVATAR: "Аватар",
				},

				OTHER: {
					ONLINE_USING: "Онлайн через",
					PRESENCE: "Статус",
					PLAYING: "Играет в",
					REG_DATE: "Дата регистрации",
					JOIN_DATE: "Дата входа",
					IN_VOICE: "В голос. канале",
					BOOSTING: "Бустит",
					BOT: "Бот",
				},
			},
		},

		SOURCE: {
			TEXT: (url) =>
				`Относительно недавно, исходный код бота был размещён на сайте GitHub: ${url}`,
		},

		COVID: {
			CASES: "Случаев",
			RECOVERED: "Спасено",
			DEATHS: "Смертей",
			TOTAL: "Всего",
			TODAY: "Сегодня",
			CRITICAL: "В критическом состоянии",
			TESTS: "Тестов",
			LAST_UPDATED: "Дата обновления",
			TOTAL_POPULATION: "Население",
		},

		STEAM: {
			FIELDS: {
				ABOUT: "Об игре",
				LANGUAGES: "Поддерживаемые языки",
				DEVELOPERS: "Разработчики",
				PLATFORMS: "Поддерживаемые платформы",
				CATEGORIES: "Категории Игры",
				GENRES: "Жанры Игры",
				RECOMENDATIONS: "Всего Рекомендаций",
				RELEASE_DATE: "Дата выхода",
				PRICE: "Стоимость игры",
				NOTES: "Записки",
			},

			PLATFORMS: {
				WINDOWS: "Windows",
				MACOS: "MacOS",
				LINUX: "Linux",
			},

			COMING_SOON: "Скоро выходит",
			DATE: "Дата выхода",
			PRICE: "Цена",
			DISCOUNT: "Скидка",
		},

		OSU: {
			FIELDS: {
				STATISTICS: "Статистика профиля",
				OTHER_USERNAMES: "Другие имена",
				GRADES: "Результаты карт",
			},

			GRADES: {
				SS: "SS",
				SSH: "SSH",
				S: "S",
				SH: "SH",
				A: "A",
			},

			ACCURACY: "Точность",
			COUNTRY: "Страна",
			PP: "PP",
			PLAYSTYLE: "Стиль игры",
			PLAYCOUNT: "Количество игр",
			MAX_COMBO: "Макс. Комбо",
			LEVEL: "Уровень",
			RANK: "Глоб. Ранг",
			COUNTRY_RANK: "Ранг в стране",
			RANKED_SCORE: "Ранкнутый счёт",
			LAST_VISIT: "Последний визит",
		},

		IMDB: {
			FIELDS: {
				DIRECTORS: "Режиссеры фильмов",
				STARS: "Звёзды в фильме",
				WRITERS: "Сценаристы фильма",
				LENGTH: "Длина фильма",
				COMPANIES: "Компании",
				COUNTRIES: "Страны",
				LANGUAGES: "Языки",
				RATINGS: "Рейтинги",
			},

			CONTENT_RATING: "Рейтинг контента",
			IMDB_RATING: "IMDB",
			RELEASE_DATE: "Дата выхода",
		},
	},

	SLASH_COMMANDS: {
		ACTIVITY: {
			INVITE: "Вот ваше приглашения: {url}",
		},
	},

	SETTINGS: {
		CONFIG: {
			TYPES: {
				CUSTOM_COMMANDS: "Кастом Команды",
				LANGUAGE: "Язык Сервера",
				MEMBERS_CHANNEL: "Канал для Участников",
				LOG_CHANNEL: "Канал для Логов",
				TWITCH_CHANNEL: "Канал для Twitch уведомлений",
				AUTO_ROLE: "Авто Роль",
				MUTE_ROLE: "Мут Роль",
				DJ_ROLES: "DJ Роли",
				TWITCH_SYSTEM: "Twitch Система",
				TWITCH_STREAMERS: "Twitch Стримеры",
				PREFIX: "Префикс",
			},
		},

		SETTED: (type, value) => `Успешно изменил "${type}" на "${value}"`,
		RESETTED: (type, value?) =>
			`Успешно установил значение "${type}" по умолчанию${
				value !== undefined ? ` (${value})` : ""
			}`,
		ADDED: (type, value) => `Успешно добавил "${value}" в "${type}"`,
		DELETED: (type, value) => `Успешно удалил "${value}" из "${type}"`,
		ENABLED: (type) => `Успешно включил "${type}"`,
		DISABLED: (type) => `Успешно выключил "${type}"`,
		SHOW: (type, value) => `"${type}" - ${value}`,

		LANGUAGE_CHANGED_NOTE:
			"Если вы сделали это случайно, то используйте команду 'language-reset'",
	},

	GIVEAWAYS: {
		PROMPTS: {
			CREATE_WINNERS: "Укажите количество победителей (10сек)",
			CREATE_PRIZE: "Укажите приз розыгрыша (20сек)",
			CREATE_TIME: "Укажите время розыгрыша (20s | 2d, 10m)",
		},

		ERRORS: {
			ERROR_WINNERS: "Вы не указали количество победителей!",
			ERROR_PRIZE: "Вы не указали приз розыгрыша!",
			ERROR_TIME: "Вы не указали время победителей!",
		},

		MESSAGES: {
			giveaway: "🎉 Розыгрыш 🎉",
			giveawayEnded: "🎉 Розыгрыш окончен 🎉",
			inviteToParticipate: "Нажмите на 🎉 для участия!",
			dropMessage: "Будьте первым, нажав на 🎉!",
			drawing: "Итоги: {timestamp}",
			winMessage:
				"Поздравляем, {winners}!\nВы победили: **{this.prize}**",
			embedFooter: "Розыгрыши",
			hostedBy: "Организатор: {this.hostedBy}",
			winners: "Победитель(-и):",
			endedAt: "Заканчивается",
		},

		RESPONSES: {
			ENDED: (id: string) => `Розыгрыш с ID "\`${id}\`" успешно отменён!`,
		},
	},

	ROLEPLAY: {
		ACTIONS: {
			TICKLE: (author, target) => `${author} пощекотал(а) ${target}!`,
			BAKA: (author, target) => `${author} ненавидит ${target}!`,
			SLAP: (author, target) => `${author} шлёпнул(а) ${target}!`,
			POKE: (author, target) => `${author} ткнул(а) в ${target}!`,
			PAT: (author, target) => `${author} погладил(а) ${target}!`,
			KISS: (author, target) => `${author} поцеловал(а) ${target}!`,
			HUG: (author, target) => `${author} обнял(а) ${target}!`,
		},

		OTHER: {
			CLICK_IF_NOT: (url) =>
				`Нажмите [здесь](${url}), если вы не видите картинку!`,
		},
	},

	ERRORS: {
		NO_ACCESS: "У вас нет доступа к этой команде!",
		MEMBER_MISSINGPERMS: (perms) =>
			`У вас нет следующих прав для этой команды: ${perms}`,
		BOT_MISSINGPERMS: (perms) =>
			`У меня нет следующих прав для этой команды: ${perms}`,
		ARGS_MISSING: (cmd_name) =>
			`Вы упустили важный аргумент!\nИспользуйте команду \`help ${cmd_name}\` для получения примера!`,
		EVAL_CANCELED:
			"Процесс обработки кода был отменен досрочно, так как ответ может содержать личную информацию!",
		GUILD_NOT_FOUND: (id) => `Сервер с ID \`${id}\` не найден!`,
		IS_NAN: (input) => `\`${input}\` - не число!`,
		USER_BOT: (target) => `${target} - бот!`,
		NOT_ENOUGH_MONEY: (action) => `У вас недостаточно коинов для ${action}`,
		MEMBER_NOT_BANNABLE: (target) =>
			`Не могу забанить ${target} потому что он имеет иммунитет от этого!`,
		MEMBER_NOT_KICKABLE: (target) =>
			`Не могу кикнуть ${target} потому что он имеет иммунитет от этого!`,
		NO_MUTEROLE:
			"Для использования этой команды, сервер должен иметь Мут Роль!",
		NO_MUTE: (member) => `${member} не имеет активного мута!`,
		NO_WARNS: (member) => `${member} не имеет предупреждений!`,
		NOT_JOINED_VOICE:
			"Для использования этой команды, вы должны зайти в голосовой канал!",
		JOIN_BOT_VOICE:
			"Для использования этой команды, вы должны зайти в единый голосовой канал с ботом!",
		QUEUE_EMPTY: "Очередь сервера пустая!",
		PAUSED: "Текущая песня на паузе!",
		RESUMED: "Текущая песня возобновлена!",
		MISSING_IN_DB: (type) => `"${type}" не найдено в Базе Данных!`,
		CANNOT_BE_EVERYONE: (type) => `"${type}" не может быть everyone!`,
		SYSTEM_NOT_ENABLED: (type) => `"${type}" не включен!`,
		SYSTEM_ENABLED: (type) => `"${type}" включен!`,
		MISSING_IN_LIST: (value, list) =>
			`"${value}" не находится в списке!\nВарианты: ${list}`,
		CHANNEL_TYPE: "Тип канала не является Текстовым или Новостным!",
		COMMAND_NOT_FOUND: (name) =>
			`Команда с названием "${name}" не найдена!`,
		BALANCE_BOTS: "Боты не могу иметь баланс!",
		GIFT_YOURSELF: "Вы не можете дарить коины самому себе!",
		NOT_FOUND: (src) => `Ваш запрос не найден в ${src}!`,
		NOT_FOUND_IN_DB: (type, value) =>
			`"${value}" не найден в типе "${type}"!`,
		ALREADY_IN_DB: (type, value) => `"${value}" уже есть в типе "${type}"`,
		EMOJIS_LIMIT: "Достигнут лимит эмодзи на сервере!",
		VALID_EMOJI: "Укажите настоящее эмодзи!",
		NORMAL_EMOJI:
			"Вы можете использовать стандартные эмодзи без добавления на сервер!",
		GIVEAWAY_NOT_FOUND: (id: string) =>
			`Розыгрыш с ID "\`${id}\`" не найден!`,
		GIVEAWAY_ENDED: (id: string) =>
			`Розыгрыш с ID "\`${id}\`" уже закончен!`,
		COVID_NOT_FOUND: (name: string) =>
			`Не могу получить информацию COVID-19 в "${name}"`,
		NEGATIVE_NUMBER: (input: string) =>
			`Данный аргумент не может быть "${input}" (негативным числом)`,
	},

	FUNCTIONS: {
		TRIMARRAY: (len) => `и ещё ${len}...`,

		VERIFICATION: {
			ACCEPT: "Принять",
			DECLINE: "Отменить",
			TEXT: "Для завершения, вам нужно убедиться, что вы ничего не перепутали.\nНажмите на зелёную кнопку, если вы сделали всё правильно, или же на красную, чтобы отменить ваше действие!",
		},

		DECL: {
			MEMBERS: ["Участник", "Участника", "Участников"],
			COINS: ["монету", "монеты", "монет"],
		},
	},

	TWITCH_HANDLER: {
		NEW_STREAM: "Новый стрим на Twitch!",
		STREAM_TITLE: "Название",
		STARTED_AT: "Дата запуска",
		GO_TO: "Перейти на стрим",
	},

	PERMISSIONS: {
		ManageGuild: "Управление сервером",
		ManageRoles: "Управление ролями",
		ManageWebhooks: "Управление вебхуком",
		ManageMessages: "Управление сообщениями",
		ManageEmojisAndStickers: "Управление Эмодзи и Стикерами",
		Administrator: "Администратор",
		BanMembers: "Бан участников",
		KickMembers: "Кик участников",
		CreateInstantInvite: "Создать приглашение",
		EmbedLinks: "Embed ссылки",
		Speak: "Говорить",
		Connect: "Подключиться",
	},

	GLOBAL: {
		BOT: "Бот",
		YES: "Да",
		NO: "Нет",
		DAYJS_FORMAT: "D [дн.,] H [чс.,] mm [мин.,] ss [сек.]",
		ENABLED: "Включено",
		DISABLED: "Отключено",
		ACCEPT: "Принять",
		DECLINE: "Отменить",
		NONE: "Отсутствует",

		STATUSES: {
			ONLINE: "Онлайн",
			IDLE: "Нет на месте",
			DND: "Не беспокоить",
			OFFLINE: "Оффлайн",
		},
	},

	SYSTEMS: {
		DJ_ROLES: {
			HASNT_ANY:
				"Вы не можете использовать эту команду, так как у вас нет DJ Роли!",
		},

		CLANS: {
			ERRORS: {
				CLAN_ALREADY_EXISTS: "Клан с данным названием уже существует!",
				CLAN_NOT_FOUND: "Клан с данным ID не найден!",
				CANNOT_FETCH:
					"Не могу извлечь информацию сервера для составления списка участников!",
				CANNOT_FETCH_MEMBER:
					"Не могу извлечь информацию пользователя для составления списка участников!",
				NO_CLANS: "На данном сервере нет кланов!",
				NOT_OWNER: "Вы не владелец этого клана!",
				NOT_IN_CLAN: "Войдите в клан перед выходом из него!",
				ALREADY_IN_CLAN:
					"Вы не можете создать клан, потому что Вы уже присоединились к другому клану!",
				ALREADY_JOINED_CLAN:
					"Вы не можете войти в клан, потому что Вы уже присоединились к другому клану!",
			},

			PROMPTS: {
				WRITE_CLAN_NAME:
					"Для создания вашего собственного клана, Вам нужно написать название вашего клана (15сек)!",
				WRITE_CLAN_ABR:
					"Напишите аббревиатуру для помощи пользователям во вступлении в клан!",
			},

			PROMPT_ERRORS: {
				CLAN_NAME: "Вы не написали название клана! Процесс отменён.",
				CLAN_ABR: "Вы не написали аббревеатуру клана! Процесс отменён.",
			},

			RESULTS: {
				CREATED: (name) => `Успешно создал клан "${name}"!`,
				JOINED: (name) => `Успешно присоединились в клан "${name}"`,
				LEFT: (name) => `Успешно вышел из клана "${name}"`,
			},
		},
	},

	EVENTS: {
		GUILD_PREFIX: (guild_name, prefix) =>
			`Префикс "${guild_name}": "\`${prefix}\`"`,
		HAPPEND_AT: (date) => `Дата произошедшего: ${date}`,

		GUILD_BIRTHDAY: {
			TEXT: (name, years, decl) =>
				`🎉 | "${name}" сегодня празднует свой день рождения! Серверу уже ${years} ${decl}!`,
			YEAR: "год",
			YEARS: "лет",
		},

		GUILD_EVENTS: {
			//guildMemberAdd | guildMemberRemove
			MEMBER_ADD: {
				TITLE: "⬆️ | Новый участник на сервере!",
				DESCRIPTION: (member) => `${member} присоединился к серверу!`,
			},
			MEMBER_REMOVE: {
				TITLE: "⬇️ | Участник покинул сервер!",
				DESCRIPTION: (member) => `${member} покинул сервер!`,
			},

			//guildMemberBoost | guildMemberUnboost
			MEMBER_BOOST: {
				TITLE: "🎉 | Участник подарил буст!",
				DESCRIPTION: (member, boosts) =>
					`${member} пробустил этот сервер!\nКоличество бустов: ${boosts}`,
			},
			MEMBER_UNBOOST: {
				TITLE: "😔 | Участник убрал буст!",
				DESCRIPTION: (member, boosts) =>
					`${member} убрал буст с сервера!\nКоличество бустов: ${boosts}`,
			},

			//guildMemberRoleAdd | guildMemberRoleRemove
			ROLE_ADD: {
				TITLE: "⬆️ | Участник получил роль!",
				DESCRIPTION: (member, role, moderator) =>
					`${member} получил роль ${role} через модератора ${moderator}`,
			},
			ROLE_REMOVE: {
				TITLE: "⬇️ | Участник потерял роль!",
				DESCRIPTION: (member, role, moderator) =>
					`${member} потерял роль ${role} через модератора ${moderator}`,
			},

			//guildBoostLevelUp | guildBoostLevelDown
			LEVEL_UP: {
				TITLE: "🎉 | Уровень буста сервера повышен!",
				DESCRIPTION: (new_level) =>
					`Уровень буста сервера повышен до ${new_level}!`,
			},
			LEVEL_DOWN: {
				TITLE: "😔 | Уровень буста сервера понижен!",
				DESCRIPTION: (new_level) =>
					`Уровень буста сервера был понижен до ${new_level}!`,
			},

			//guildPartnerAdd | guildPartnerRemove
			PARTNERED: {
				TITLE: "🎉 | Сервер получил Партнёрство!",
				DESCRIPTION: 'Сервер получил статус "Партёрский"',
			},
			UNPARTNERED: {
				TITLE: "😔 | Сервер потерял Партнёрство!",
				DESCRIPTION: 'Сервер потерял статус "Партнёрский"',
			},

			//guildVerificationAdd | guildVerificationRemove
			VERIFIED: {
				TITLE: "🎉 | Сервер получил Верификацию!",
				DESCRIPTION: 'Сервер получил статус "Верифицированный"',
			},
			UNVERIFIED: {
				TITLE: "😔 | Сервер потерял Верификацию!",
				DESCRIPTION: 'Сервер потерял статус "Верифицированный"!',
			},

			//guildBanAdd | guildBanRemove
			BAN_ADD: {
				TITLE: "🛡️ | Пользователь был забанен!",
				DESCRIPTION: (member, tag, moderator, reason) =>
					`${member} (${tag}) был забанен ${moderator}\n› Причина: ${reason}`,
			},
			BAN_REMOVE: {
				TITLE: "🛡️ | Пользователь был разбанен!",
				DESCRIPTION: (member, tag, moderator, reason) =>
					`${member} (${tag}) был раззабанен ${moderator}\n› Причина бана: ${reason}`,
			},
		},

		LEVELING: {
			NEWLEVEL: (user, level) =>
				`🎉 | ${user} повысил свой уровень до ${level}`,
		},

		MESSAGE_EVENTS: {
			DELETE: {
				TITLE: "🗑️ | Сообщение удалено!",
				DESCRIPTION: (author, content) =>
					`Сообщение от ${author} было удалено!\n\n› Содержание сообщения: \`${content}\``,

				GHOST_PING: {
					TITLE: "⚠️ | Обнаружены упоминания",
					DESCRIPTION: (author, content) =>
						`Похоже, что сообщение от ${author} имело упоминания!\n\n› Содержание сообщения: \`${content}\``,
				},
			},
			UPDATE: {
				TITLE: "⬆️ | Изменено сообщение!",
				DESCRIPTION: (author, old_content, new_content) =>
					`Сообщение от ${author} было изменено!\n\n› Старое содержание: \`${old_content}\`\n› Новое содержание: \`${new_content}\``,
				GO_TO: "Jump to Message",
			},
			CREATE: {
				ANTI_FISH: {
					TYPES: {
						IP_LOGGER: "IP Логгер",
						PHISHING: "Фишинговая",
					},

					TITLE: "⚠️ | Обнаружена Фишинговая Ссылка",
					DESCRIPTION: (type, author, content) =>
						`Похоже, что сообщение от ${author} имеет фишинговые ссылки (${type})!\n\n› Содержание сообщения: ||\`${content}\`||`,
				},
			},
		},

		MUSIC_EVENTS: {
			ADD_SONG: {
				EMBED_TITLE: "🎶 | Добавляю песню в очередь",
				TITLE: "Название",
				URL: "Ссылка",
				VIEWS: "Просмотров",
				DURATION: "Длина",
				SONGS: "Песен в очереди",
				REQUESTED_BY: "Запросил",
			},

			PLAY_SONG: {
				EMBED_TITLE: "🎶 | Проигрываю песню из очереди",
				TITLE: "Название",
				URL: "Ссылка",
				VIEWS: "Просмотров",
				DURATION: "Длина",
				SONGS: "Песен в очереди",
				REQUESTED_BY: "Запросил",
			},

			ADD_LIST: {
				EMBED_TITLE: "🎶 | Добавляю плейлист в очередь",
				TITLE: "Название",
				URL: "Ссылка",
				VIEWS: "Просмотров",
				DURATION: "Длина",
				PLAYLIST_SONGS: "Песен в плейлисте",
				SONGS: "Песен в очереди",
				REQUESTED_BY: "Запросил",
			},

			FINISH: "Очередь песен окончена, бот покинул Голосовой Канал!",
			EMPTY: "Голосовой канал пустой, бот покинул его!",
			ERROR: (message) => `Упс, произошла ошибка: ${message}`,
		},
	},
};

export default Russian;
