import prompts, { PromptObject } from "prompts";
import fs from "node:fs";

const config_template_text = `
{
	"bot": {
		"defaultPrefix": "!",
		"token": "NO-TOKEN",
		"testToken": "NO-TOKEN",
		"test": true,
		"migrate_to_slash": false,
		"github_link": "https://github.com/user/repo",
		"support_server": "https://discord.gg/code"
	},

	"sentry": {
		"enabled": false,
		"dsn": "NO-DSN"
	},

	"languages": ["ru-RU", "en-EN"],

	"keys": {
		"steam_key": "NO-TOKEN",
		"osu_client_id": 0,
		"osu_client_secret": "NO-TOKEN",
		"imdb_key": "NO-TOKEN",
		"tracker_key": "NO-TOKEN"
	},

	"twitch": {
		"client_id": "NO-TOKEN",
		"client_secret": "NO-TOKEN"
	}
}
`;

const config_template = JSON.parse(config_template_text);
const questions: PromptObject[] = [
	{
		type: "confirm",
		name: "test_mode",
		message: "Would you like to turn on test mode?",
	},
	{
		type: "text",
		name: "default_prefix",
		message: "What is the default prefix?",
		initial: "!",
	},
	{
		type: "password",
		name: "bot_token",
		message: "What is the bot token?",
	},
];

(async () => {
	const answers = await prompts(questions);

	config_template.bot.test = answers.test_mode;
	config_template.bot.defaultPrefix = answers.default_prefix;
	config_template.bot.token = answers.bot_token;
	config_template.bot.testToken = answers.bot_token;

	fs.writeFileSync(
		"./src/cfg.ts",
		`export = ${JSON.stringify(config_template, null, 2)};`
	);

	console.log("Config file has been created.");
})();
