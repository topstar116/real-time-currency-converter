import userSettingRepository from "@/repositories/UserSettingRepository";
import currencyRepository, {
  TLocaleCodes,
} from "@/repositories/CurrencyRepository";

export default async function () {
  const createContextmenu = async (onServiceWorker = false) => {
    chrome.contextMenus.removeAll();
    const userSetting = await userSettingRepository.get();
    if (onServiceWorker) {
      //you can not use chorme i18n api in  service worker js,so we need to give it a default
      //you can find a report of this bug at https://bugs.chromium.org/p/chromium/issues/detail?id=1159438
      Object.values(userSetting.frequentlyUsedCurrencies).forEach((key) => {
        chrome.contextMenus.create({
          id: `convertTo${key}`,
          title: `Convert To ${key}`,
          type: "normal",
          contexts: ["selection"],
        });
      });
    } else {
      const contextMenuNamedConvertTo = chrome.i18n.getMessage(
        "context_menu_named_convert_to"
      );

      const localeString = chrome.i18n.getUILanguage().replace("-", "_");

      Object.values(userSetting.frequentlyUsedCurrencies).forEach((key) => {
        const currency = currencyRepository
          .findByLocale(<TLocaleCodes>localeString)
          .find((currency) => currency.code == key);
        chrome.contextMenus.create({
          id: `convertTo${key}`,
          title: `${contextMenuNamedConvertTo} ${currency?.name}`,
          type: "normal",
          contexts: ["selection"],
        });
      });
    }
  };

  return {
    createContextmenu,
  };
}
