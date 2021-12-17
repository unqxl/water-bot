import { bold } from "@discordjs/builders";
import {
	ButtonInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";
import client from "..";
import ghosts from "../data/phasmaphobia_ghosts.json";

interface FakeEvidence {
	first: string;
	second: string;
	third: string;
}

export = async (
	msg: Message,
	message: Message,
	lang: typeof import("@locales/English").default
) => {
	// Ghosts
	const [
		banshee,
		goryo,
		demon,
		jinn,
		spirit,
		shade,
		phantom,
		hantu,
		mare,
		wraith,
		revenant,
		raiju,
		the_twins,
		poltergeist,
		myling,
		yurei,
		yokai,
		oni,
		onryo,
		obake,
	] = [
		lang.GAMES.PHASMOPHOBIA.GHOSTS.BANSHEE,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.GORYO,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.DEMON,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.JINN,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.SPIRIT,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.SHADE,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.PHANTOM,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.HANTU,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.MARE,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.WRAITH,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.REVENANT,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.RAIJU,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.THE_TWINS,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.POLTERGEIST,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.MYLING,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.YUREI,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.YOKAI,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.ONI,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.ONRYO,
		lang.GAMES.PHASMOPHOBIA.GHOSTS.OBAKE,
	];

	// Evidences
	const [emf, dots, orbs, fingerprints, writing, freezing, spiritbox] = [
		lang.GAMES.PHASMOPHOBIA.EVIDENCES.EMF,
		lang.GAMES.PHASMOPHOBIA.EVIDENCES.DOTS,
		lang.GAMES.PHASMOPHOBIA.EVIDENCES.ORBS,
		lang.GAMES.PHASMOPHOBIA.EVIDENCES.FINGERPRINTS,
		lang.GAMES.PHASMOPHOBIA.EVIDENCES.WRITING,
		lang.GAMES.PHASMOPHOBIA.EVIDENCES.FREEZING,
		lang.GAMES.PHASMOPHOBIA.EVIDENCES.SPIRIT_BOX,
	];

	const fakeEvidences: FakeEvidence[] = [
		{
			first: emf,
			second: orbs,
			third: spiritbox,
		},
		{
			first: fingerprints,
			second: dots,
			third: writing,
		},
		{
			first: emf,
			second: fingerprints,
			third: freezing,
		},
		{
			first: emf,
			second: spiritbox,
			third: writing,
		},
		{
			first: fingerprints,
			second: dots,
			third: freezing,
		},
		{
			first: emf,
			second: orbs,
			third: dots,
		},
		{
			first: orbs,
			second: freezing,
			third: fingerprints,
		},
		{
			first: orbs,
			second: emf,
			third: spiritbox,
		},
	];

	const firstFake: FakeEvidence =
		fakeEvidences[Math.floor(Math.random() * fakeEvidences.length)];
	const secondFake: FakeEvidence =
		fakeEvidences[Math.floor(Math.random() * fakeEvidences.length)];
	const successEvidences: string[] = [];

	const randomGhost = ghosts[Math.floor(Math.random() * ghosts.length)];
	const formattedName = randomGhost.name.replace("{", "").replace("}", "");

	var ghostType = "";
	switch (formattedName) {
		case "banshee":
			ghostType = banshee;
			break;

		case "goryo":
			ghostType = goryo;
			break;

		case "demon":
			ghostType = demon;
			break;

		case "jinn":
			ghostType = jinn;
			break;

		case "spirit":
			ghostType = spirit;
			break;

		case "shade":
			ghostType = shade;
			break;

		case "phantom":
			ghostType = phantom;
			break;

		case "hantu":
			ghostType = hantu;
			break;

		case "mare":
			ghostType = mare;
			break;

		case "wraith":
			ghostType = wraith;
			break;

		case "revenant":
			ghostType = revenant;
			break;

		case "raiju":
			ghostType = raiju;
			break;

		case "the_twins":
			ghostType = the_twins;
			break;

		case "poltergeist":
			ghostType = poltergeist;
			break;

		case "myling":
			ghostType = myling;
			break;

		case "yurei":
			ghostType = yurei;
			break;

		case "yokai":
			ghostType = yokai;
			break;

		case "oni":
			ghostType = oni;
			break;

		case "onryo":
			ghostType = onryo;
			break;

		case "obake":
			ghostType = obake;
			break;
	}

	const description = lang.GAMES.PHASMOPHOBIA.WELCOME.replace(
		"{type}",
		ghostType
	);
	const firstEmbed = new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor(
			msg.author.username,
			msg.author.displayAvatarURL({ dynamic: true })
		)
		.setDescription(bold(description))
		.setTimestamp();

	randomGhost.evidences.forEach((evidence) => {
		switch (evidence) {
			case "emf5":
				successEvidences.push(emf);
				break;

			case "dots":
				successEvidences.push(dots);
				break;

			case "fingerprints":
				successEvidences.push(fingerprints);
				break;

			case "writing":
				successEvidences.push(writing);
				break;

			case "freezing":
				successEvidences.push(freezing);
				break;

			case "spiritbox":
				successEvidences.push(spiritbox);
				break;

			case "orbs":
				successEvidences.push(orbs);
				break;
		}
	});

	const buttons = new MessageActionRow();
	buttons.addComponents(
		shuffle(
			new MessageButton()
				.setStyle("SECONDARY")
				.setCustomId("success")
				.setLabel(successEvidences.join(", ")),

			new MessageButton()
				.setStyle("SECONDARY")
				.setCustomId("fake")
				.setLabel(
					`${firstFake.first}, ${firstFake.second}, ${firstFake.third}`
				),

			new MessageButton()
				.setStyle("SECONDARY")
				.setCustomId("fake_1")
				.setLabel(
					`${secondFake.first}, ${secondFake.second}, ${secondFake.third}`
				)
		)
	);

	await message
		.edit({
			content: null,
			embeds: [firstEmbed],
			components: [buttons],
		})
		.then(async (reply) => {
			const collector = await reply.createMessageComponentCollector({
				filter: (btn) => btn.user.id === msg.author.id,
				time: 30000,
				max: 1,
			});

			collector.on("collect", async (collected: ButtonInteraction) => {
				switch (collected.customId) {
					case "success": {
						const success = lang.GAMES.PHASMOPHOBIA.WIN;
						const embed = client.functions.buildEmbed(
							msg,
							"BLURPLE",
							bold(success),
							"🎉",
							true
						);

						client.economy.balance.add(
							500,
							msg.author.id,
							message.guild.id
						);

						reply.edit({
							embeds: [embed],
							components: [],
						});
						return;
					}

					case "fake":
					case "fake_1": {
						const failure = lang.GAMES.PHASMOPHOBIA.DEFEAT.replace(
							"{correct}",
							successEvidences.join(", ")
						);
						const embed = client.functions.buildEmbed(
							msg,
							"BLURPLE",
							bold(failure),
							"❌",
							true
						);

						reply.edit({
							embeds: [embed],
							components: [],
						});
						return;
					}
				}
			});

			collector.on("end", async (collected, reason) => {
				if (reason === "time") {
					const timeout = lang.GAMES.PHASMOPHOBIA.TIMEOUT;
					const embed = client.functions.buildEmbed(
						msg,
						"BLURPLE",
						bold(timeout),
						"❌",
						true
					);

					reply.edit({
						embeds: [embed],
						components: [],
					});
					return;
				}
			});
		});
};

function shuffle(...components: any[]): any[] {
	const arr = [];
	arr.push(...components);

	var currentIndex = arr.length,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[arr[currentIndex], arr[randomIndex]] = [
			arr[randomIndex],
			arr[currentIndex],
		];
	}

	return arr;
}
