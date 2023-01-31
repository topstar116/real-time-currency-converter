<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-config-provider
            :theme="currentTheme.value"
            :locale="naiveUiLocale"
            :date-locale="naiveUiDateLocale"
          >
            <n-page-header>
              <template #title> {{ chrome_extension_name }}</template>
              <template #avatar>
                <n-avatar
                  round
                  :src="require('../../assets/copper_coins.png')"
                />
              </template>
              <template #extra>
                <n-space>
                  <n-button size="small" @click="toggleTheme"
                    >{{ nextThemeName }}
                  </n-button>
                </n-space>
              </template>
            </n-page-header>
            <n-layout embedded content-style="padding: 5px;">
              <n-grid :x-gap="12" :y-gap="8" :cols="3">
                <n-grid-item>
                  <div style="display: none" />
                </n-grid-item>
                <n-grid-item>
                  <user-setting-form />
                </n-grid-item>
                <n-grid-item>
                  <div style="display: none" />
                </n-grid-item>
              </n-grid>
            </n-layout>
            <n-global-style />
          </n-config-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<script lang="ts" setup>
import {
  NLayout,
  NPageHeader,
  NButton,
  NSpace,
  NAvatar,
  NConfigProvider,
  NGlobalStyle,
  NGrid,
  NGridItem,
  NMessageProvider,
  NLoadingBarProvider,
  NNotificationProvider,
  NDialogProvider,
} from "naive-ui";
import UseTheme from "@/hooks/useTheme";
import useI18n from "@/hooks/useI18n";
import UserSettingForm from "./UserSettingForm.vue";
const { currentTheme, nextThemeName, toggleTheme } = UseTheme();
const { chrome_extension_name, naiveUiLocale, naiveUiDateLocale } = useI18n();
</script>

<style lang="scss">
body {
  padding: 5px;
}
</style>
