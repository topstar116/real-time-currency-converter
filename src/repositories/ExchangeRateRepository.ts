import apiFactory, {
  ExchangeRates,
  TApiNames,
} from "@/services/ExchangeRateApiService";
import { db } from "@/db";
import { IExchangeRate } from "@/models/IExchangeRate";
import { LocalDate } from "@js-joda/core";
import MathUtils from "@/utils/MathUtils";
import DateUtils from "@/utils/DateUtils";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";
import userSettingRepository from "@/repositories/UserSettingRepository";
export type TDateExchangeRate = {
  date: string;
  value: ExchangeRates | undefined;
};
/**
 * Data service of currency exchange rate
 */
interface ExchangeRateRepository {
  /**
   * Load exchange rate table for a day
   * @param date Date the exchange rate was published
   */
  table(date: LocalDate): Promise<ExchangeRates | undefined>;

  /**
   * Get an array of exchange rate table .
   * from the {@link beginDate} and according to the {@link pattern} to calculate the end date
   * @param beginDate begin date
   * @param pattern End date calculation pattern string. Consists of a +/- sign and the number of days.eg: +8 indicates to get the exchange rate table array from the {@link beginDate} to 8 days later
   */
  tables(
    beginDate: LocalDate,
    pattern: string
  ): Promise<Array<TDateExchangeRate>>;
  /**
   * Check if there is exchange rate data for a certain day in the database
   * @param date date
   */
  existByDate(date: LocalDate): Promise<boolean>;
  /**
   * get exchange rate between {@link srcCode} and {@link targetCode}
   * @param srcCode source currency code
   * @param targetCode target currency code
   * @param baseCode if no direct exchange rate between srcCode and targetCode is found,it will be calculated from this base value
   * @param decimal decimal of returned exchange rate value
   * @param date date the exchange rate was published
   */
  findBy(
    srcCode: TCurrencyCodes,
    targetCode: TCurrencyCodes,
    baseCode: TCurrencyCodes,
    decimal: number,
    date: LocalDate
  ): Promise<number>;
}

class DefaultExchangeRateDataService implements ExchangeRateRepository {
  readonly baseCode: TCurrencyCodes;

  constructor(baseCode: TCurrencyCodes = "USD") {
    this.baseCode = baseCode;
  }

  async table(
    date: LocalDate = LocalDate.now()
  ): Promise<ExchangeRates | undefined> {
    let rates: ExchangeRates | undefined = undefined;
    const userSetting = await userSettingRepository.get();
    const exchangeRateApi = apiFactory(<TApiNames>userSetting.preferredApi);
    const dateStr = DateUtils.toString(date);
    if (date.isEqual(LocalDate.now())) {
      rates = await exchangeRateApi.latest(this.baseCode);
    } else if (date.isBefore(LocalDate.now())) {
      if (
        (
          await db.exchangeRates
            .where({
              date: dateStr,
            })
            .toArray()
        ).length == 0
      )
        rates = await exchangeRateApi.histories(dateStr, this.baseCode);
    } else
      throw new Error(
        `Wrong date of ${dateStr}.Must specify today or a previous date`
      );

    if (rates) {
      const data = Object.keys(rates).map((k) => {
        return {
          srcCode: this.baseCode,
          targetCode: k,
          value: rates ? rates[k] : 0,
          date: dateStr,
        } as IExchangeRate;
      });
      db.exchangeRates
        .bulkPut(data)
        .then(() => {
          console.log(`Done adding ${data.length} ExchangeRateDataModels`);
        })
        .catch((e) => {
          console.error(e);
          console.error(
            `Some ExchangeRateDataModels did not succeed. However,${
              data.length - e.failures.length
            }ExchangeRateDataModels was added successfully`
          );
        });
    }

    return rates;
  }

  async findBy(
    srcCode: TCurrencyCodes,
    targetCode: TCurrencyCodes,
    baseCode: TCurrencyCodes | undefined = this.baseCode,
    decimal = 6,
    date: LocalDate = LocalDate.now()
  ): Promise<number> {
    const dateStr = DateUtils.toString(date);
    const directExchangeRate = await db.exchangeRates
      .where({
        date: dateStr,
        srcCode,
        targetCode,
      })
      .first();
    if (directExchangeRate == undefined) {
      const rateOfBaseToSrc = await db.exchangeRates
        .where({
          srcCode: baseCode,
          targetCode: srcCode,
          date: dateStr,
        })
        .first();
      const rateOfBaseToTarget = await db.exchangeRates
        .where({
          srcCode: baseCode,
          targetCode,
          date: dateStr,
        })
        .first();
      if (rateOfBaseToTarget?.value && rateOfBaseToSrc?.value) {
        return MathUtils.round(
          rateOfBaseToTarget?.value / rateOfBaseToSrc?.value,
          decimal
        );
      } else return 0;
    } else return MathUtils.round(directExchangeRate.value, decimal);
  }

  async existByDate(date: LocalDate): Promise<boolean> {
    const exchangeRatesOfCertainDay = await db.exchangeRates
      .where({
        date: DateUtils.toString(date),
      })
      .toArray();

    return exchangeRatesOfCertainDay.length > 0;
  }

  async tables(
    beginDate: LocalDate,
    pattern: string
  ): Promise<Array<TDateExchangeRate>> {
    const match = /^([+-])(\d+)/g.exec(pattern);
    if (!match)
      throw new Error(
        "You must specify a date pattern in a valid format. Like +8 or -8"
      );
    const direction = match[1];
    const days = parseInt(match[2]);
    const exchangeRates: Array<TDateExchangeRate> = [
      {
        date: DateUtils.toString(beginDate),
        value: await this.table(beginDate),
      },
    ];
    switch (direction) {
      case "+":
        for (let i = 1; i < days; i++) {
          const date = beginDate.plusDays(i);
          exchangeRates.push({
            date: DateUtils.toString(date),
            value: await this.table(date),
          });
        }
        break;
      case "-":
        for (let i = 1; i < days; i++) {
          const date = beginDate.minusDays(i);
          exchangeRates.push({
            date: DateUtils.toString(date),
            value: await this.table(date),
          });
        }
        break;
    }

    return direction === "-" ? exchangeRates.reverse() : exchangeRates;
  }
}

/**
 * global currency exchange rate data service
 */
const exchangeRateRepository = new DefaultExchangeRateDataService();
export default exchangeRateRepository;
