import { CronCommand, CronJob } from "cron";
import Bot from "../classes/Bot";

export class Job extends CronJob {
	constructor(
		client: Bot,
		name: string,
		cronTime: string | Date,
		onTick: CronCommand,
		onComplete?: CronCommand | null,
		start?: boolean,
		timeZone?: string,
		context?: any,
		runOnInit?: boolean,
		utcOffset?: string | number,
		unrefTimeout?: boolean
	) {
		super(
			cronTime,
			onTick,
			onComplete,
			start,
			timeZone,
			context,
			runOnInit,
			utcOffset,
			unrefTimeout
		);

		client.logger.log(`Job with name "${name}" started!`);
	}
}
