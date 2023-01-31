import { Ref, ref } from "vue";
import { __SUPPORTED_LANGUAGES__ } from "@/global";
import { NLocale } from "naive-ui/lib/locales/common/enUS";
import { NDateLocale } from "naive-ui/lib/locales/date/enUS";
import StringUtils from "@/utils/StringUtils";
import currencyRepository, {
  TLocaleCodes,
} from "@/repositories/CurrencyRepository";
import { IUserSetting } from "@/models/IUserSetting";
export type TUserSettingFormItemNames = keyof IUserSetting;
export type TFormItemI18n = {
  path: string;
  label: string;
  required_message?: string;
  placeholder?: string;
  tips?: string;
};
export type TUserSettingFormItems = {
  [key in TUserSettingFormItemNames]?: TFormItemI18n;
};

export type TUserSettingFormI18n = {
  save: {
    [key in "success" | "fail"]:
      | string
      | ((substitutions?: string | string[] | undefined) => string);
  };
  items: TUserSettingFormItems;
};
export default function () {
  const chrome_extension_name = ref(
    chrome.i18n.getMessage("chrome_extension_name")
  );
  const chrome_extension_description = ref(
    chrome.i18n.getMessage("chrome_extension_description")
  );
  const app_language = ref(chrome.i18n.getMessage("app_language"));
  const supportedLanguages = ref(__SUPPORTED_LANGUAGES__);
  const addNewConversionButtonText = ref(
    chrome.i18n.getMessage("add_conversion_button_text")
  );
  const deleteConversionButtonText = ref(
    chrome.i18n.getMessage("delete_conversion_button_text")
  );
  const naiveUiLocale = ref<NLocale | null>(null);
  const naiveUiDateLocale = ref<NDateLocale | null>(null);
  const localeString = chrome.i18n.getUILanguage().replace("-", "");
  const localeString2 = ref(chrome.i18n.getUILanguage().replace("-", "_"));
  const currencies = ref(
    currencyRepository.findByLocale(<TLocaleCodes>localeString2.value)
  );
  const getCurrencySymbol = (code: string): string | undefined => {
    return currencies.value.find((currency) => {
      return currency.code == code;
    })?.symbol;
  };
  import(`naive-ui`).then((navui: { [key: string]: any }) => {
    naiveUiLocale.value = <NLocale>navui[localeString];
    naiveUiDateLocale.value = <NDateLocale>(
      navui[`date${StringUtils.capitalizeFirst(localeString)}`]
    );
  });
  const userSettingFormI18n: TUserSettingFormI18n = {
    save: {
      success: JSON.parse(
        chrome.i18n.getMessage("user_setting_form_save_messages", "")
      )["success"],
      fail: (substitutions?: string | string[] | undefined) => {
        return JSON.parse(
          chrome.i18n.getMessage(
            "user_setting_form_save_messages",
            substitutions
          )
        )["fail"];
      },
    },
    items: {},
  };
  [
    "preferredApi",
    "frequentlyUsedCurrencies",
    "updateFrequency",
    "enableHistoricalReporting",
    "apiKeys",
    "wordMarkingRules",
  ].forEach((name) => {
    userSettingFormI18n.items[<TUserSettingFormItemNames>name] = JSON.parse(
      chrome.i18n.getMessage(
        `user_setting_form_item_${StringUtils.toSnakeCase(name)}`
      )
    );
  });

  return {
    chrome_extension_name,
    chrome_extension_description,
    app_language,
    supportedLanguages,
    naiveUiLocale,
    naiveUiDateLocale,
    addNewConversionButtonText,
    deleteConversionButtonText,
    localeString2,
    currencies,
    getCurrencySymbol,
    userSettingFormI18n,
  };
}
