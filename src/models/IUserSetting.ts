/**
 * This class is used to store user settings
 */
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";

export interface IUserSetting {
  /**
   * Preferred API for getting foreign currency exchange rate data
   */
  preferredApi: string;

  /**
   * Frequently used currencies
   */
  frequentlyUsedCurrencies: TCurrencyCodes[];

  /**
   * How often the exchange rate data is updated in minutes.
   */
  updateFrequency: number;

  /**
   * Whether to enable the data report, if enabled,
   * a line chart showing the exchange rate history of each foreign currency
   * within the specified number of days
   * will be generated at the bottom of the converter page
   *
   * <p>
   *  <strong>Important:</strong>
   *  Only works if api=OpenExchange
   * </p>
   */
  enableHistoricalReporting: boolean;

  /**
   *
   * If you use <a href="https://openexchangerates.org/">OpenExchange</a>, you need an application key,
   * which you can create via this <a href="https://openexchangerates.org/signup/free">link</a>
   */
  apiKeys: string[];

  wordMarkingRules: string[];
}
