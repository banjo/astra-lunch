import { DatabaseService } from "./services/DatabaseService";
import { FetchService } from "./services/FetchService";
import { SlackService } from "./services/SlackService";
import { DateUtil } from "./utils/DateUtil";

const fetchLunch = async () => {
    const success = await FetchService.fetchLunches();
    const weekNumber = DateUtil.getWeekNumber();
    const sent = await DatabaseService.hasSentLunchForWeek(weekNumber);

    if (success && !sent) {
        await DatabaseService.setSentLunchForWeek(weekNumber);
        await SlackService.sendDailyLunch();
    }
};

const sendToSlack = async () => {
    await SlackService.sendDailyLunch();
};

export { fetchLunch, sendToSlack };
