import { Message } from "discord.js";
import { Command } from "../../types/Command/Command";
import { Categories, ValidateReturn } from "../../types/Command/BaseCommand";
import { SteamIDConverter } from "../../plugins/SteamIDConverter";
import { bold } from "@discordjs/builders";
import Bot from "../../classes/Bot";

const Converter = new SteamIDConverter();

export default class SteamIDCommand extends Command {
	constructor(client: Bot) {
		super(client, {
			name: "steamid",

			description: {
				en: "Converts SteamID/SteamID64/SteamID3",
				ru: "Конвертирует SteamID/SteamID64/SteamID3",
			},

			category: Categories.OTHER,
			usage: "<prefix>steamid <steamid64/steamid3/steamid>",
		});
	}

	async validate(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const id = args[0];
		if (!id) {
			const text = lang.ERRORS.ARGS_MISSING.replace(
				"{cmd_name}",
				"steamid"
			);

			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}

		if (
			Converter.isSteamID(id) ||
			Converter.isSteamID3(id) ||
			Converter.isSteamID64(id)
		) {
			return {
				ok: true,
			};
		} else {
			const text = lang.MODULES.STEAMID.NOT_STEAMID;
			const embed = this.client.functions.buildEmbed(
				message,
				"BLURPLE",
				bold(text),
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed],
				},
			};
		}
	}

	async run(
		message: Message,
		args: string[],
		lang: typeof import("@locales/English").default
	) {
		const id = args[0];

		const [SteamID, SteamID3, SteamID64, ProfileURL] = [
			Converter.toSteamID(id) as string,
			Converter.toSteamID3(id) as string,
			Converter.toSteamID64(Converter.toSteamID(id) as string) as string,
			Converter.profileURL(
				Converter.toSteamID64(Converter.toSteamID(id) as string)
			) as string,
		];

		const text = lang.MODULES.STEAMID.ANSWER(
			SteamID,
			SteamID64,
			SteamID3,
			ProfileURL
		);
		const embed = this.client.functions.buildEmbed(
			message,
			"BLURPLE",
			bold(text),
			false,
			true
		);

		embed.setThumbnail(
			"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/80px-Steam_icon_logo.svg.png"
		);

		return message.channel.send({
			embeds: [embed],
		});
	}
}
