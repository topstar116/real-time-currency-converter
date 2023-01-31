import userSettingRepository from "@/repositories/UserSettingRepository";
import exchangeRateRepository from "@/repositories/ExchangeRateRepository";
import { LocalDate } from "@js-joda/core";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  LegendComponent,
  LegendComponentOption,
  GridComponent,
  GridComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";
import DateUtils from "@/utils/DateUtils";
import useI18n from "@/hooks/useI18n";

export type TCreateChartFun = (
  days: number,
  src: TCurrencyCodes,
  targets: TCurrencyCodes[]
) => void;
export type TExchangeRateChatDurationsOption = {
  [key in "week" | "month"]?: {
    label: string;
    value: number;
  };
};
type TExchangeRateChatOptionsI18n = {
  title: string;
};
export default async function (chartId: string) {
  const enable = (await userSettingRepository.get()).enableHistoricalReporting;
  if (enable) {
    const durationsOption: TExchangeRateChatDurationsOption = JSON.parse(
      chrome.i18n.getMessage("exchange_rate_chart_duration")
    ) as TExchangeRateChatDurationsOption;
    echarts.use([
      LineChart,
      TitleComponent,
      CanvasRenderer,
      GridComponent,
      LegendComponent,
      TooltipComponent,
    ]);
    type EChartsOption = echarts.ComposeOption<
      | TitleComponentOption
      | LineSeriesOption
      | GridComponentOption
      | LegendComponentOption
      | TooltipComponentOption
    >;
    const createChart: TCreateChartFun = async (
      days: number,
      src: TCurrencyCodes,
      targets: TCurrencyCodes[]
    ) => {
      const dateExchangeRates = await exchangeRateRepository.tables(
        LocalDate.now(),
        `-${days}`
      );
      const labels = dateExchangeRates.map((it) =>
        it.date.substring(it.date.indexOf("-") + 1)
      );

      const series = await Promise.all(
        targets.map(async (code) => {
          return {
            name: code,
            type: "line",
            smooth: true,
            data: await Promise.all(
              dateExchangeRates.map(async (value) => {
                return await exchangeRateRepository.findBy(
                  src,
                  code,
                  exchangeRateRepository.baseCode,
                  6,
                  DateUtils.parse(value.date)
                );
              })
            ),
          } as LineSeriesOption;
        })
      );
      console.log({ dateExchangeRates, labels, series });
      const chartDom = document.getElementById(chartId);
      const myChart = echarts.init(chartDom!);
      console.log(targets);
      const { currencies } = useI18n();
      const srcCurrencyName = currencies.value.find(
        (currency) => currency.code == src
      )?.name;
      const optionI18n: TExchangeRateChatOptionsI18n = JSON.parse(
        chrome.i18n.getMessage("exchange_rate_chart_options", [
          srcCurrencyName!,
          days.toString(),
        ])
      );
      const option: EChartsOption = {
        darkMode: false,
        legend: {
          bottom: 10,
        },
        tooltip: {
          trigger: "axis",
        },
        title: {
          left: "center",
          text: optionI18n.title,
        },
        xAxis: {
          type: "category",
          data: labels,
        },
        yAxis: {
          type: "value",
        },
        series,
      };

      option && myChart.setOption(option);
    };

    return { enable, createChart, durationsOption };
  }

  return { enable };
}
