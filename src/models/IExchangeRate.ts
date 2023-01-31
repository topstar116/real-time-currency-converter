import { TCurrencyCodes } from "@/repositories/CurrencyRepository";

/**
 * This class is used to store currency exchange rate data for a particular day
 */
export interface IExchangeRate {
  /**
   * source currency code
   */
  srcCode: TCurrencyCodes;

  /**
   * target currency code
   */
  targetCode: TCurrencyCodes;

  /**
   * date of this exchange rate published
   */
  date: string;

  /**
   * exchange rate value
   */
  value: number;
}
