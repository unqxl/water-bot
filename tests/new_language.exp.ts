// Created with GitHub Copilot.

const language_pack = {
	STRING: "This is a %s! This is a %s!",
};

Object.values(language_pack).forEach((value) => {
	if (typeof value !== "string") {
		throw new Error(`Language pack value "${value}" is not a string`);
	}

	const matches = value.match(/%s/g);
	if (matches) {
		format(value, ...matches);
	}
});

function format(language_pack, ...args) {
	const string = language_pack.replace(/%s/g, (match) => {
		return args.shift();
	});
	console.log(string);
	return string;
}

const get = (language_pack, key, ...args) => {
	return format(language_pack[key], ...args);
};

get(language_pack, "STRING", "test", "test2");
