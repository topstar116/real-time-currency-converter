<template>
  <n-space vertical>
    <n-space v-for="(currency, i) in model.currencies" :key="i">
      <n-input-number
        :show-button="true"
        v-model:value="model.values[i]"
        min="0"
        size="large"
        class="amount"
        @update:value="!disableUpdate && calc(i)"
      >
        <template #prefix>{{ getCurrencySymbol(currency) }}</template>
      </n-input-number>
      <n-select
        v-model:value="model.currencies[i]"
        filterable
        :options="options"
        size="large"
        @update:value="
          calc(latestUpdate);
          emitUpdateProfileEvent();
        "
      />
      <n-button
        v-if="i === model.currencies.length - 1"
        type="success"
        @click="
          model.currencies.push('USD');
          model.values.push(1);
          calc(latestUpdate);
          emitUpdateProfileEvent();
        "
      >
        {{ addNewConversionButtonText }}
      </n-button>
      <n-button
        v-if="model.currencies.length > 1"
        type="error"
        @click="
          model.currencies.splice(i, 1);
          model.values.splice(i, 1);
          latestUpdate = 0;
          calc(latestUpdate);
          emitUpdateProfileEvent();
        "
      >
        {{ deleteConversionButtonText }}
      </n-button>
    </n-space>
    <n-space v-if="enableHistoricalReporting" vertical>
      <n-radio-group
        v-model:value="exchangeRateChartSpan"
        name="radiobuttongroup2"
        size="medium"
      >
        <template v-if="exchangeRateChartDurationsOption">
          <n-radio-button
            :key="key"
            v-for="(option, key) in exchangeRateChartDurationsOption"
            :value="option.value"
          >
            {{ option.label }}
          </n-radio-button>
        </template>
      </n-radio-group>
      <div id="exchangeRateChart" style="width: 600px; height: 300px"></div>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import {
  ComponentInternalInstance,
  computed,
  defineProps,
  getCurrentInstance,
  onMounted,
  reactive,
  Ref,
  ref,
  watch,
  withDefaults,
} from "vue";
import {
  NInputNumber,
  NSpace,
  NSelect,
  SelectGroupOption,
  SelectOption,
  NButton,
  NRadioButton,
  NRadioGroup,
} from "naive-ui";
import currencyConversionService from "@/services/CurrencyConversionService";
import MathUtils from "@/utils/MathUtils";
import useI18n from "@/hooks/useI18n";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";
import exchangeRateRepository from "@/repositories/ExchangeRateRepository";
import useHistoryReport, {
  TCreateChartFun,
  TExchangeRateChatDurationsOption,
} from "@/hooks/useCharts";
import { ArrayStream } from "@/utils/Stream";
import { IConversionProfile } from "@/models/IConversionProfile";

interface Model {
  currencies: TCurrencyCodes[];
  values: number[];
}
const props = withDefaults(
  defineProps<{
    profile: IConversionProfile;
  }>(),
  {
    profile: () => {
      return {
        src: "CNY",
        amount: 1,
        targets: ["AED"],
      };
    },
  }
);
const {
  addNewConversionButtonText,
  deleteConversionButtonText,
  currencies,
  getCurrencySymbol,
} = useI18n();

const model = ref({
  currencies: [props.profile.src, ...props.profile.targets],
  values: [
    props.profile.amount,
    ...Array(props.profile.targets.length).fill(0),
  ],
} as Model);
const options: Array<SelectOption | SelectGroupOption> = currencies.value.map(
  (currency) => {
    return {
      label: `${currency.emoji} ${currency.code} —— ${currency.name}`,
      value: `${currency.code}`,
      ...currency,
    };
  }
);
const enableHistoricalReporting = ref(false);
const exchangeRateChartSpan = ref(7);
watch(exchangeRateChartSpan, (value) => {
  calc(latestUpdate.value);
});
const exchangeRateChartDurationsOption: Ref<
  TExchangeRateChatDurationsOption | undefined
> = ref({});
const disableUpdate = ref(false);
const latestUpdate = ref(0);
const calc = (index: number) => {
  disableUpdate.value = true;
  let srcCurrency = model.value.currencies[index];
  let srcAmount = model.value.values[index];
  model.value.currencies.forEach(
    async (targetCurrency: TCurrencyCodes, i: number) => {
      if (i !== index) {
        const targetAmount = await currencyConversionService.convert(
          srcCurrency,
          targetCurrency,
          srcAmount
        );
        model.value.values[i] = MathUtils.round(targetAmount, 6);

        console.log({
          srcCurrency,
          srcAmount,
          targetCurrency: targetCurrency,
          targetValue: targetAmount,
          rate: await exchangeRateRepository.findBy(
            srcCurrency,
            targetCurrency
          ),
        });
      }
    }
  );
  latestUpdate.value = index;
  disableUpdate.value = false;
  if (enableHistoricalReporting.value && createChartFun) {
    createChartFun(
      exchangeRateChartSpan.value,
      srcCurrency,
      ArrayStream.of(model.value.currencies).skip(index).value
    );
  }
};
let createChartFun: TCreateChartFun | undefined = undefined;
const { emit } = getCurrentInstance() as ComponentInternalInstance;
const emitUpdateProfileEvent = () => {
  emit("update:profile", {
    src: model.value.currencies[0],
    amount: model.value.values[0],
    targets: model.value.currencies.slice(1),
  } as IConversionProfile);
};
onMounted(async () => {
  const { enable, createChart, durationsOption } = await useHistoryReport(
    "exchangeRateChart"
  );
  enableHistoricalReporting.value = enable;
  createChartFun = createChart;
  exchangeRateChartDurationsOption.value = durationsOption;
  calc(0);
});
</script>

<style scoped lang="scss">
.amount {
  width: 200px;
}
:deep(.n-input__prefix) {
  width: 25px;
  transition: color 0.3s var(--n-bezier);
  flex-wrap: nowrap;
  flex-shrink: 0;
  line-height: var(--n-height);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
