import OsuAPI from "../classes/API/classes/osu";
import cfg from "../cfg";

const osu = new OsuAPI(cfg.keys.osu_client_id, cfg.keys.osu_client_secret);
(async () => {
	var data = await osu.getBeatmapList("Big Black", "osu");
	data = data.sort((a, b) => b.play_count - a.play_count);
	data = data.slice(0, 10);

	for (let i = 0; i < data.length; i++) {
		console.log(`${data[i].title} - ${data[i].creator}`);
	}
})();
