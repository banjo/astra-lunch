import { Logger } from "./logger";
import { DatabaseService } from "./services/DatabaseService";
import { FetchService } from "./services/FetchService";
import { SlackService } from "./services/SlackService";
import { DateUtil } from "./utils/DateUtil";

const fetchLunch = async () => {
    const success = await FetchService.fetchLunches();

    Logger.log(`Success to fetch lunches: ${success}`);

    if (!success) {
        Logger.log("Failed to fetch lunches");
        return;
    }

    const weekNumber = DateUtil.getWeekNumber();
    const sent = await DatabaseService.hasSentLunchForWeek(weekNumber);

    Logger.log(`Has sent lunch for week ${weekNumber}: ${sent}`);

    if (!sent) {
        await DatabaseService.setSentLunchForWeek(weekNumber);
        await SlackService.sendDailyLunch();
    }
};

const sendToSlack = async () => {
    await SlackService.sendDailyLunch();
};

export { fetchLunch, sendToSlack };
