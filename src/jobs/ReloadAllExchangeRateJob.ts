import { CronJob } from "cron";
import exchangeRateRepository from "@/repositories/ExchangeRateRepository";
import Timezone from "timezone-enum";
/**
 * This task is used to update the latest exchange rate every 30 minutes
 */
const reloadAllExchangeRateJob = new CronJob(
  "0 */30 * * * *",
  async () => {
    console.log("job with reload all exchange rate is running...");
    await exchangeRateRepository.table();
  },
  () => {
    console.log("job with reload all exchange rate has completed.");
  },
  true,
  Timezone["Asia/Shanghai"],
  null,
  true
);

export default reloadAllExchangeRateJob;
