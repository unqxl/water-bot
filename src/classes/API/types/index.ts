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
