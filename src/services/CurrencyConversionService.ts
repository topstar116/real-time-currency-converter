import exchangeRateRepository from "@/repositories/ExchangeRateRepository";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";
import MathUtils from "@/utils/MathUtils";

export interface CurrencyConversionService {
  convert(srcCode: string, targetCode: string, amount: number): Promise<number>;
}

export class DefaultCurrencyConversionService
  implements CurrencyConversionService
{
  async convert(
    srcCode: TCurrencyCodes,
    targetCode: TCurrencyCodes,
    amount: number,
    decimal = 6
  ): Promise<number> {
    const rate = await exchangeRateRepository.findBy(srcCode, targetCode);
    return MathUtils.round(rate * amount, decimal);
  }
}

const currencyConversionService = new DefaultCurrencyConversionService();

export default currencyConversionService;
