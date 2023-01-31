import { ICurrency } from "@/models/ICurrency";
import currenciesData from "./currencies.json";
import currency_codes_openchangeapi from "./currency_codes_openchangeapi.json";
import currency_codes_outisnemo from "./currency_codes_outisnemo.json";
import exchangeRateRepository from "@/repositories/ExchangeRateRepository";
export type TCurrencies = typeof currenciesData;
export type TLocaleCodes = keyof TCurrencies;
export type TOpenchangeCurrencyCodes =
  keyof typeof currency_codes_openchangeapi;
export type TOutisnemoCurrencyCodes = keyof typeof currency_codes_outisnemo;
export type TCurrencyCodes = TOpenchangeCurrencyCodes | TOutisnemoCurrencyCodes;
export const currencies: TCurrencies = currenciesData;

/**
 * Data service of Currency
 */
interface ICurrencyRepository {
  /**
   * Return to localized currency list
   * @param localeCode locale code
   */
  findByLocale(localeCode: TLocaleCodes): ICurrency[];

  findFirstBySymbol(
    symbol: string,
    localeCode: TLocaleCodes
  ): ICurrency | undefined;
}
class DefaultCurrencyRepository implements ICurrencyRepository {
  findByLocale(localeCode: TLocaleCodes = "zh_CN"): ICurrency[] {
    return Object.values(currencies[localeCode])
      .map((it) => it as ICurrency)
      .filter((currency) => {
        return Object.keys(currency_codes_openchangeapi).includes(
          currency.code
        );
      });
  }

  findFirstBySymbol(
    symbol: string,
    localeCode: TLocaleCodes = "zh_CN"
  ): ICurrency | undefined {
    return this.findByLocale(localeCode).find((currency) => {
      return currency.symbol == symbol;
    });
  }
}
const currencyRepository = new DefaultCurrencyRepository();
export default currencyRepository;
