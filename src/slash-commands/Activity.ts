import {
	GuildMember,
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";
import { CommandInteraction } from "discord.js";
import { ValidateReturn } from "types/Command/BaseSlashCommand";
import { SlashCommand } from "../types/Command/SlashCommand";
import Bot from "../classes/Bot";

export default class ActivitySlashCommand extends SlashCommand {
	constructor(client: Bot) {
		super(client, {
			name: "activity",
			description: "Let's Play!",
			type: ApplicationCommandType.ChatInput,

			options: [
				{
					name: "type",
					description: "Activity Type",
					required: true,
					type: ApplicationCommandOptionType.String,

					choices: [
						{
							name: "YouTube",
							value: "youtube",
						},
						{
							name: "Poker",
							value: "poker",
						},
						{
							name: "Chess",
							value: "chess",
						},
						{
							name: "Checkers in the Park",
							value: "checkers",
						},
						{
							name: "Fishington",
							value: "fishington",
						},
						{
							name: "Letter Tile",
							value: "lettertile",
						},
						{
							name: "Words Snack",
							value: "wordssnack",
						},
						{
							name: "Doodle Crew",
							value: "doodlecrew",
						},
						{
							name: "SpellCast",
							value: "spellcast",
						},
						{
							name: "Awkword",
							value: "awkword",
						},
						{
							name: "Puttparty",
							value: "puttparty",
						},
					],
				},
			],
		});
	}

	async validate(
		interaction: CommandInteraction,
		lang: typeof import("@locales/English").default
	): Promise<ValidateReturn> {
		const voiceChannel = (interaction.member as GuildMember).voice.channel;
		if (!voiceChannel) {
			const error = lang.ERRORS.NOT_JOINED_VOICE;
			const embed = this.client.functions.buildEmbed(
				{ author: interaction.user },
				"Red",
				error,
				false,
				"❌",
				true
			);

			return {
				ok: false,
				error: {
					embeds: [embed.toJSON()],
				},
			};
		}

		return {
			ok: true,
		};
	}

	async run(
		interaction: CommandInteraction,
		lang: typeof import("@locales/English").default
	) {
		const activity = interaction.options.get("type", true);
		const invite = await this.client.together.createTogetherCode(
			(interaction.member as GuildMember).voice.channel.id,
			// @ts-ignore | It's working!
			activity
		);

		const text = lang.SLASH_COMMANDS.ACTIVITY.INVITE.replace(
			"{url}",
			invite.code
		);
		const embed = this.client.functions.buildEmbed(
			{ author: interaction.user },
			"Blurple",
			text,
			false,
			"🎮",
			true
		);

		return interaction.reply({
			embeds: [embed.toJSON()],
		});
	}
}
