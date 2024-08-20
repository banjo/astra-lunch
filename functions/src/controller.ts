import { getWeekNumber } from "@banjoanton/utils";
import { Logger } from "./logger";
import { DatabaseService } from "./services/DatabaseService";
import { FetchService } from "./services/FetchService";
import { SlackService } from "./services/SlackService";
import { DateUtil } from "./utils/DateUtil";

const fetchLunch = async (skipSlack = false) => {
    const success = await FetchService.fetchLunches();

    if (!success) {
        Logger.log("Failed to fetch lunches");
        return;
    }

    Logger.log(`Success to fetch lunches: ${success}`);

    const weekNumber = DateUtil.getWeekNumber();
    const sent = await DatabaseService.hasSentLunchForWeek(weekNumber);

    Logger.log(`Has sent lunch for week ${weekNumber}: ${sent}`);

    if (!sent && !skipSlack) {
        await DatabaseService.setSentLunchForWeek(weekNumber);
        await SlackService.sendDailyLunch();
    }
};

const sendToSlack = async () => {
    await SlackService.sendDailyLunch();
};

const trySendToSlack = async () => {
    const weekNumber = DateUtil.getWeekNumber();
    const sent = await DatabaseService.hasSentLunchForWeek(weekNumber);

    Logger.log(`Has sent lunch for week ${weekNumber}: ${sent}`);

    if (!sent) {
        await DatabaseService.setSentLunchForWeek(weekNumber);
        await SlackService.sendDailyLunch();
    }
};

const cleanAndFetch = async () => {
    await DatabaseService.deleteWeeklyFoodByWeekNumber(getWeekNumber());
    const success = await FetchService.fetchLunches();

    if (!success) {
        Logger.log("Failed to fetch lunches");
        return;
    }

    Logger.log(`Success to fetch lunches: ${success}`);
};

export { fetchLunch, sendToSlack, trySendToSlack, cleanAndFetch };
