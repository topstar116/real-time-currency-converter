import { CronJob } from "cron";
describe("cron", () => {
  it("simple", () => {
    const job = new CronJob("* * * * * *", function () {
      console.log("You will see this message every second");
    });
    job.start();
  });
});
