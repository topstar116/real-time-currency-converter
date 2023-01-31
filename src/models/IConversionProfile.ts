import { TCurrencyCodes } from "@/repositories/CurrencyRepository";

export interface IConversionProfile {
  src: TCurrencyCodes;
  amount: number;
  targets: TCurrencyCodes[];
}
