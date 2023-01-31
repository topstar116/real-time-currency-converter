import { IUserSetting } from "@/models/IUserSetting";
import currencyRepository, {
  currencies,
  TCurrencyCodes,
  TLocaleCodes,
} from "@/repositories/CurrencyRepository";
import { ArrayStream, StringStream } from "@/utils/Stream";
import { ICurrency } from "@/models/ICurrency";

interface UserSettingRepository {
  get(): Promise<IUserSetting>;

  save(userSetting: IUserSetting): Promise<void>;
}

class DefaultUserSettingRepository implements UserSettingRepository {
  async get(): Promise<IUserSetting> {
    const defaultUserSetting: IUserSetting = {
      apiKeys: [
        "15e0a8fb77f44c73baeb1614e548c284",
        "0ca0c602c38049cb90cbe09a1a70eb75",
      ],
      frequentlyUsedCurrencies: [<TCurrencyCodes>StringStream.of(
          chrome.i18n.getUILanguage()
        ) // ui language for google chrome,like zh-CN,en-US
          .substringAfterLast("-") //only get the country code
          .toStringStream((value) => {
            return (
              ArrayStream.of(Object.keys(currencies)) //locale codes
                .toStringStream((localeCodes) => localeCodes[0]) //first locale code
                .toArrayStream(
                  (localeCode) =>
                    <ICurrency[]>(
                      Object.values(currencies[<TLocaleCodes>localeCode])
                    )
                ) //get currencies of this locale code
                .value.find((it) => it.code.includes(value))?.code ?? "" // find the first currency that contains the country code
            );
          }).value],
      enableHistoricalReporting: true,
      preferredApi: "OpenExchange",
      updateFrequency: 60,
      wordMarkingRules: ["{S} {A}", "{A} {C}"],
    };
    const res = (
      await chrome.storage.sync.get({
        userSettings: defaultUserSetting,
      })
    )["userSettings"] as IUserSetting;
    return res;
  }

  async save(userSetting: IUserSetting): Promise<void> {
    return await chrome.storage.sync.set({
      userSettings: userSetting,
    });
  }
}

const userSettingRepository = new DefaultUserSettingRepository();
export default userSettingRepository;
