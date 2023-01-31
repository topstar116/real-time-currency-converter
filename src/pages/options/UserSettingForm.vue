<template>
  <n-form
    ref="userSettingForm"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
    size="large"
    :style="{
      maxWidth: '640px',
    }"
  >
    <n-form-item
      :label="items.preferredApi.label"
      :path="items.preferredApi.path"
    >
      <n-radio-group
        v-model:value="model.preferredApi"
        name="preferredApiRadio"
      >
        <n-radio-button
          :key="api.name"
          v-for="api in supportedApis"
          :value="api.name"
          >{{ api.name }}
        </n-radio-button>
      </n-radio-group>
    </n-form-item>

    <n-form-item
      :label="items.frequentlyUsedCurrencies.label"
      :path="items.frequentlyUsedCurrencies.path"
    >
      <n-select
        v-model:value="model.frequentlyUsedCurrencies"
        filterable
        multiple
        :options="frequentlyUsedCurrenciesOptions"
        size="large"
      />
    </n-form-item>

    <n-form-item
      :label="items.updateFrequency.label"
      :path="items.updateFrequency.path"
    >
      <n-input-number v-model:value="model.updateFrequency" />
    </n-form-item>
    <n-form-item
      :label="items.apiKeys.label"
      v-if="model.preferredApi === 'OpenExchange'"
      :path="items.apiKeys.path"
    >
      <template #label>
        <n-tooltip :style="{ maxWidth: '400px' }" trigger="hover">
          <template #trigger>
            <n-button text @click="openKeyRequestPage">
              {{ items.apiKeys.label }}
            </n-button>
          </template>
          {{ items.apiKeys.tips }}
        </n-tooltip>
      </template>
      <n-input
        v-model:value="model.apiKeys"
        :placeholder="items.apiKeys.placeholder"
        type="textarea"
        :autosize="{
          minRows: 5,
          maxRows: 50,
        }"
      />
    </n-form-item>
    <n-form-item
      :label="items.enableHistoricalReporting.label"
      :path="items.enableHistoricalReporting.path"
    >
      <n-switch v-model:value="model.enableHistoricalReporting" />
    </n-form-item>
    <n-form-item
      :label="items.wordMarkingRules.label"
      :path="items.wordMarkingRules.path"
    >
      <template #label>
        <n-tooltip :style="{ maxWidth: '400px' }" trigger="hover">
          <template #trigger>
            <n-button text>
              {{ items.wordMarkingRules.label }}
            </n-button>
          </template>
          {{ items.wordMarkingRules.tips }}
        </n-tooltip>
      </template>

      <n-input
        v-model:value="model.wordMarkingRules"
        :placeholder="items.wordMarkingRules.placeholder"
        type="textarea"
        :autosize="{
          minRows: 5,
          maxRows: 50,
        }"
      />
    </n-form-item>

    <div style="display: flex; justify-content: flex-end">
      <n-button round type="primary" @click="saveUserSetting"> 保存 </n-button>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import {
  FormInst,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSwitch,
  NButton,
  NTooltip,
  useMessage,
  SelectOption,
  SelectGroupOption,
  NSelect,
} from "naive-ui";
import { computed, onMounted, ref, Ref } from "vue";
import useI18n, {
  TUserSettingFormItemNames,
  TUserSettingFormItems,
} from "@/hooks/useI18n";
import ObjectMapper, { Transformers } from "@/utils/ObjectMapper";
import userSettingRepository from "@/repositories/UserSettingRepository";
import { supportedApis } from "@/services/ExchangeRateApiService";
import { IUserSetting } from "@/models/IUserSetting";
import useContextmenu from "@/hooks/useContextmenu";
import useChromeTab from "@/hooks/useChromeTab";
const { userSettingFormI18n, currencies } = useI18n();

let model: Ref<{
  [key in TUserSettingFormItemNames]?: string | number | boolean;
}> = ref({});
const items: TUserSettingFormItems = userSettingFormI18n.items;
const rules = {
  preferredApi: {
    required: true,
    trigger: ["blur"],
    message: items.preferredApi?.required_message,
  },
};
const message = useMessage();
const userSettingForm = ref<FormInst | null>(null);
let createContextMenuFn: () => void;
const saveUserSetting = (e: MouseEvent) => {
  e.preventDefault();
  userSettingForm.value?.validate((errors) => {
    if (!errors) {
      const latest: IUserSetting = ObjectMapper.map(model.value, {
        apiKeys: Transformers.StringToArray(),
        wordMarkingRules: Transformers.StringToArray(),
      }) as IUserSetting;
      userSettingRepository
        .save(latest)
        .then(() => {
          message.success(userSettingFormI18n.save.success);
          if (createContextMenuFn) createContextMenuFn();
        })
        .catch((reason) => {
          if (typeof userSettingFormI18n.save.fail == "function")
            message.error(
              userSettingFormI18n.save.fail(JSON.stringify(reason))
            );
        });
    }
  });
};
const frequentlyUsedCurrenciesOptions: Array<SelectOption | SelectGroupOption> =
  currencies.value.map((currency) => {
    return {
      label: `${currency.emoji} ${currency.code} —— ${currency.name}`,
      value: `${currency.code}`,
      ...currency,
    };
  });

let openNewTabFn: (url: string) => void;
const openKeyRequestPage = () => {
  if (openNewTabFn) openNewTabFn("https://openexchangerates.org/signup/free");
};
onMounted(async () => {
  const userSetting = await userSettingRepository.get();
  model.value = ObjectMapper.map(userSetting, {
    apiKeys: Transformers.ArrayToString(),
    wordMarkingRules: Transformers.ArrayToString(),
    frequentlyUsedCurrencies: Transformers.ObjectToArray(),
  });
  const { createContextmenu } = await useContextmenu();
  createContextMenuFn = createContextmenu;

  const { openNewTab } = await useChromeTab();
  openNewTabFn = openNewTab;
});
</script>

<style scoped></style>
