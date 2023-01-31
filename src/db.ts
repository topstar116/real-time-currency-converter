import Dexie, { Table } from "dexie";
import { IExchangeRate } from "@/models/IExchangeRate";

export class CurrencyConverterDatabase extends Dexie {
  exchangeRates!: Table<IExchangeRate>;

  constructor() {
    super("CurrencyConverterDatabase");
    this.version(1).stores({
      exchangeRates: "[date+srcCode+targetCode]", // Primary key and indexed props
    });
  }
}

export const db = new CurrencyConverterDatabase();
