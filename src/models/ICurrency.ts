/**
 * represents a currency
 */
export interface ICurrency {
  /**
   * name of this currency.eg Chinese Yuan
   */
  name: string;
  /**
   * the symbol used to represent this currency. eg $
   */
  symbol: string;

  /**
   * code of this currency. eg USD
   */
  code: string;
  /**
   * the emoji of the currency, usually a national flag if it's fiat currency, or a brand if it's a data currency
   */
  emoji?: string;
}
