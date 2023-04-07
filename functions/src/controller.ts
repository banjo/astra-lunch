import { FetchService } from "./services/FetchService";
import { SlackService } from "./services/SlackService";

const fetchLunch = async () => {
    await FetchService.fetchLunches();
};

const sendToSlack = async () => {
    await SlackService.sendDailyLunch();
};

export { fetchLunch, sendToSlack };
