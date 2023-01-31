import {
  BaseService,
  GET,
  ServiceBuilder,
  BasePath,
  Query,
  Path,
} from "ts-retrofit";
import ArrayUtils from "@/utils/ArrayUtils";
import userSettingRepository from "@/repositories/UserSettingRepository";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";

/**
 * Exchange rate api service
 */
interface IExchangeRateApiService {
  /**
   * Get the latest exchange rates available from the remote api
   * @param base Change base currency (3-letter code, default: USD)
   */
  latest(base: TCurrencyCodes): Promise<ExchangeRates>;

  /**
   * Get historical exchange rates for any date available from the remote api
   * @param date The requested date in YYYY-MM-DD format (required).
   * @param base Change base currency (3-letter code, default: USD)
   */
  histories(date: string, base: TCurrencyCodes): Promise<ExchangeRates>;
}

export interface ExchangeRates {
  [key: string]: number;
}

class OutisnemoApiService
  extends BaseService
  implements IExchangeRateApiService
{
  @GET("/minimal-currency-converter")
  async latest(base: TCurrencyCodes = "EUR"): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }
  @GET("https://raw.githubusercontent.com/cruldra/raws/main/empty.json")
  async histories(date: string, base: TCurrencyCodes): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }
}

@BasePath("/api")
class OpenExchangeRatesApiService
  extends BaseService
  implements IExchangeRateApiService
{
  @GET("/latest.json")
  async latest(
    @Query("base") base: TCurrencyCodes = "USD"
  ): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }
  @GET("/historical/{date}.json")
  async histories(
    @Path("date") date: string,
    base: TCurrencyCodes = "USD"
  ): Promise<ExchangeRates> {
    return <ExchangeRates>{};
  }
}

/**
 * fiat currency exchange rate api
 *
 * @deprecated This api is free, but it does not support historical exchange rate query
 */
const outisnemoApiService = new ServiceBuilder()
  .setEndpoint("https://outisnemo.com")
  .setStandalone(true)
  .setTimeout(30000)
  .setRequestInterceptors((config) => {
    config.params["timestamp"] = new Date().getTime();
    return config;
  })
  .setResponseInterceptors((response) => {
    return response.data["rates"];
  })
  .build(OutisnemoApiService);

const openExchangeRatesApiService = new ServiceBuilder()
  .setEndpoint("https://openexchangerates.org")
  .setStandalone(true)
  .setTimeout(30000)
  .setRequestInterceptors(async (config) => {
    config.params["app_id"] = ArrayUtils.randomItem(
      (await userSettingRepository.get()).apiKeys
    );
    return config;
  })
  .setResponseInterceptors((response) => {
    return response.data["rates"];
  })
  .build(OpenExchangeRatesApiService);
export type TApiNames = "OpenExchange" | "Outisnemo";
export type TApi = {
  name: TApiNames;
  referLink?: string;
};
export const supportedApis: TApi[] = [
  {
    name: "OpenExchange",
    referLink: "https://openexchangerates.org/signup/free",
  },
  {
    name: "Outisnemo",
  },
];
const apiFactory = (name: TApiNames): IExchangeRateApiService => {
  switch (name) {
    case "OpenExchange":
      return openExchangeRatesApiService;
    case "Outisnemo":
      return outisnemoApiService;
  }
};
export default apiFactory;
