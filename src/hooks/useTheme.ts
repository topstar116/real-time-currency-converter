import { darkTheme, GlobalTheme } from "naive-ui";
import { ref, Ref } from "vue";

interface Theme {
  name: string;
  value: GlobalTheme | null;
}
const theme_name_light = chrome.i18n.getMessage("app_theme_light");
const theme_name_dark = chrome.i18n.getMessage("app_theme_dark");
const availableThemes: Theme[] = [
  {
    name: theme_name_dark,
    value: darkTheme,
  },
  {
    name: theme_name_light,
    value: null,
  },
];
export default function () {
  const currentTheme: Ref<Theme> = ref(availableThemes[0]);
  const nextThemeName: Ref<string> = ref(availableThemes[1].name);
  return {
    currentTheme,
    nextThemeName,
    toggleTheme() {
      console.log("toggle theme");
      const indexOfCurrent = availableThemes.findIndex((theme) => {
        return theme.name == currentTheme.value.name;
      });
      if (indexOfCurrent == 0) {
        currentTheme.value = availableThemes[1];
        nextThemeName.value = availableThemes[0].name;
      } else if (indexOfCurrent == 1) {
        currentTheme.value = availableThemes[0];
        nextThemeName.value = availableThemes[1].name;
      }
      console.log(`current theme name:${currentTheme.value.name}`);
    },
  };
}
