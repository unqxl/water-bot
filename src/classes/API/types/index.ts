/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SteamAppList {
	applist: {
		apps: SteamAppFromList[];
	};
}

interface SteamAppFromList {
	appid: number;
	name: string;
}

export interface BestMatch {
	target: string;
	rating: number;
}

export interface SteamAppDetail {
	success: boolean;
	data: SteamAppData;
}

export interface SteamAppData {
	type: string;
	name: string;
	steam_appid: number;
	required_age: number;
	is_free: boolean;
	controller_support: string;
	dlc: number[];
	detailed_description: string;
	about_the_game: string;
	short_description: string;
	supported_languages: string;
	header_image: string;
	website: string;
	pc_requirements: {
		minimum: string;
	};
	developers: string[];
	publishers: string[];
	price_overview: {
		currency: string;
		initial: number;
		final: number;
		discount_percent: number;
		inital_formatted: string;
		final_formatted: string;
	};
	packages: number[];
	package_groups: object[];
	platforms: {
		windows: boolean;
		mac: boolean;
		linux: boolean;
	};
	metacritic: {
		score: number;
		url: string;
	};
	categories: SteamAppCategoryOrGenre[];
	genres: SteamAppCategoryOrGenre[];
	screenshots: object[];
	movies: object[];
	recommendations: {
		total: number;
	};
	achievements: {
		total: number;
		highlited: object[];
	};
	release_date: {
		coming_soon: true;
		date: string;
	};
	support_info: {
		url: string;
		email: string;
	};
	background: string;
	content_descriptors: {
		ids: number[];
		notes: string;
	};
}

interface SteamAppCategoryOrGenre {
	id: number;
	description: string;
}

export interface OsuUserData {
	avatar_url: string;
	country_code: string;
	default_group: string;
	id: number;
	is_active: boolean;
	is_bot: boolean;
	is_deleted: boolean;
	is_online: boolean;
	is_supporter: boolean;
	last_visit: string;
	pm_friends_only: boolean;
	profile_colour: string | null;
	username: string;
	groups?: string[];
	country: {
		code: string;
		name: string;
	};
	cover: {
		custom_url: string;
		url: string;
		id: string;
	};
	statistics: {
		level: {
			current: number;
			progress: number;
		};
		global_rank: number;
		country_rank: number;
		pp: number;
		ranked_score: number;
		hit_accuracy: number;
		play_count: number;
		play_time: number;
		total_score: number;
		total_hits: number;
		maximum_combo: number;
		replays_watched_by_others: number;
		is_ranked: number;
		grade_counts: {
			ss: number;
			ssh: number;
			s: number;
			sh: number;
			a: number;
		};
	};
	support_level: number;
	cover_url: string;
	discord: string;
	has_supported: boolean;
	interests: string;
	join_date: string;
	kudosu: {
		total: number;
		available: number;
	};
	location: string;
	max_blocks: number;
	max_friends: number;
	occupation: string;
	playmode: string;
	playstyle: string[];
	post_count: number;
	profile_order: string[];
	title: string;
	title_url: string;
	twitter: string;
	website: string;
	is_restricted: boolean;
	account_history: [];
	active_tournament_banner: null;
	badges: {
		awarded_at: string;
		description: string;
		image_url: string;
		url: string;
	}[];
	beatmap_playcounts_count: number;
	comments_count: number;
	favourite_beatmapset_count: number;
	follower_count: number;
	graveyard_beatmapset_count: number;
	loved_beatmapset_count: number;
	mapping_follower_count: number;
	monthly_playcounts: {
		start_date: string;
		count: number;
	}[];
	page: {
		html: string;
		raw: string;
	};
	pending_beatmapset_count: number;
	previous_usernames: string[];
	ranked_beatmapset_count: number;
	replays_watched_counts: {
		start_date: string;
		count: number;
	}[];
	scores_best_count: number;
	scores_first_count: number;
	scores_recent_count: number;
	user_achievements: {
		achieved_at: string;
		achievement_id: number;
	}[];
	rankHistory: {
		mode: string;
		data: number[];
	};
	rank_history: {
		mode: string;
		data: number[];
	};
	ranked_and_approved_beatmapset_count: number;
	unranked_beatmapset_count: number;
}

export interface IMDBSearchData {
	searchType: string;
	expression: string;
	results: IMDBSearchResult[];
	errorMessage: string;
}

export interface IMDBSearchResult {
	id: string;
	resultType: string;
	image: string;
	title: string;
	description: string;
}

export interface IMDBFilmData {
	id: string;
	title: string;
	originalTitle: string;
	fullTitle: string;
	type: string;
	year: string;
	image: string;
	releaseDate: string;
	runtimeMins: string;
	runtimeStr: string;
	plot: string;
	plotLocal: string;
	plotLocalIsRtl: boolean;
	awards: string;
	directors: string;
	directorList: { id: string; name: string }[];
	writers: string;
	writerList: { id: string; name: string }[];
	stars: string;
	starList: { id: string; name: string }[];
	actorList: { id: string; name: string }[];
	fullCast: null | any;
	genres: string;
	genreList: { id: string; name: string }[];
	companies: string;
	companyList: { id: string; name: string }[];
	countries: string;
	countryList: { id: string; name: string }[];
	languages: string;
	languageList: { id: string; name: string }[];
	contentRating: string;
	imDbRating: string;
	imDbRatingVotes: string;
	metacriticRating: string;
	ratings: null | any;
	wikipedia: null | any;
	posters: null | any;
	images: null | any;
	trailer: null | any;
	boxOffice: {
		budget: string;
		openingWeekendUSA: string;
		grossUSA: string;
		comulativeWorldwideGross: string;
	};
	tagline: string;
	keywords: string;
	keywordList: string[];
	similars: {
		id: string;
		title: string;
		fullTitle: string;
		year: string;
		image: string;
		plot: string;
		directors: string;
		stars: string;
		genres: string;
		imDbRating: string;
	}[];
	tvSeriesInfo: null | any;
	tvEpisodeInfo: null | any;
	errorMessage: null | any;
}
