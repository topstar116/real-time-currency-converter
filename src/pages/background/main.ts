import useContextmenu from "@/hooks/useContextmenu";
import UserSettingRepository from "@/repositories/UserSettingRepository";
import XRegExp from "xregexp";
import currencyRepository from "@/repositories/CurrencyRepository";

chrome.runtime.onInstalled.addListener(async () => {
  const { createContextmenu } = await useContextmenu();

  await createContextmenu(true);
});
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  const symbolPreferenceCode: { [key: string]: string } = {
    $: "USD",
    "¥": "CNY",
  };
  const currencySymbolPattern = "(?<symbol>\\p{Sc}{1})";
  const amountPattern = "(?<amount>[\\d,]+(\\.\\d+)?)";
  const currencyCodePattern = "(?<code>[a-zA-Z]{3})";
  const spacesPattern = "\\p{Zs}*";
  const userSetting = await UserSettingRepository.get();
  const profile = userSetting.wordMarkingRules
    .map((rule) => {
      rule = rule.replace("{A}", amountPattern);
      rule = rule.replace("{S}", currencySymbolPattern);
      rule = rule.replace("{C}", currencyCodePattern);
      rule = rule.replace(" ", spacesPattern);
      const regex = XRegExp(rule);
      const match = XRegExp.exec(item.selectionText ?? "", regex);
      return match
        ? {
            currencySymbol: match.groups ? match.groups["symbol"] : "",
            currencyCode: match.groups ? match.groups["code"] : "",
            amount: Number.parseFloat(
              (match.groups ? match.groups["amount"] : "").replace(",", "")
            ),
          }
        : {
            currencySymbol: "",
            currencyCode: "",
            amount: 0,
          };
    })
    .find((it) => {
      return (it.currencySymbol && it.amount) || (it.currencyCode && it.amount);
    });

  if (profile) {
    if (!profile.currencyCode && profile.currencySymbol)
      profile.currencyCode =
        symbolPreferenceCode[profile.currencySymbol] ??
        currencyRepository.findFirstBySymbol(profile.currencySymbol)?.code;

    const targets = Object.values(userSetting.frequentlyUsedCurrencies).join(
      ","
    );
    await chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/popup.html?src=${profile.currencyCode}&targets=${targets}&amount=${profile.amount}`,
    });
  }
  throw new Error("can't recognize amount text");
});
