import exchangeRateRepository from "@/repositories/ExchangeRateRepository";
import { db } from "@/db";

describe("repository", () => {
  it("exchangeRateRepository.reloadAll", async () => {
    await exchangeRateRepository.table();
    expect((await db.exchangeRates.toArray()).length == 168);
  });

  it("exchangeRateRepository.findBy", async () => {
    await exchangeRateRepository.table();
    console.log(await exchangeRateRepository.findBy("USD", "CNY", "EUR", 2));
    expect((await db.exchangeRates.toArray()).length == 169);
  });
});
