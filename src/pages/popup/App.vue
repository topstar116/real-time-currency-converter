<template>
  <n-config-provider
    :theme="currentTheme.value"
    :locale="naiveUiLocale"
    :date-locale="naiveUiDateLocale"
  >
    <n-page-header>
      <template #title> {{ chrome_extension_name }}</template>
      <template #avatar>
        <n-avatar round :src="require('../../assets/copper_coins.png')" />
      </template>
      <template #extra>
        <n-space>
          <n-button size="small" @click="toggleTheme"
            >{{ nextThemeName }}
          </n-button>
        </n-space>
      </template>
    </n-page-header>
    <n-layout embedded content-style="padding: 10px;">
      <currency-converter v-model:profile="conversionProfile" />
    </n-layout>
    <n-global-style />
  </n-config-provider>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import reloadAllExchangeRateJob from "@/jobs/ReloadAllExchangeRateJob";
import CurrencyConverter from "@/components/CurrencyConverter.vue";
import {
  NLayout,
  NPageHeader,
  NButton,
  NSpace,
  NAvatar,
  NConfigProvider,
  NGlobalStyle,
} from "naive-ui";
import UseTheme from "@/hooks/useTheme";
import useI18n from "@/hooks/useI18n";
import UseProfile from "@/hooks/useProfile";

const { conversionProfile } = UseProfile();
const { currentTheme, nextThemeName, toggleTheme } = UseTheme();
const { chrome_extension_name, naiveUiLocale, naiveUiDateLocale } = useI18n();

onBeforeMount(async () => {
  reloadAllExchangeRateJob.start();
});
onBeforeUnmount(() => {
  reloadAllExchangeRateJob.stop();
});
</script>

<style lang="scss">
body {
  width: 600px;
  padding: 5px;
}
</style>
