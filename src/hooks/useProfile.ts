import { createStore } from "@satha/core";
import { IConversionProfile } from "@/models/IConversionProfile";
import { ref, Ref, watch } from "vue";
import { TCurrencyCodes } from "@/repositories/CurrencyRepository";
export default function () {
  const conversionProfile: Ref<IConversionProfile> = ref<IConversionProfile>({
    src: "CNY",
    amount: 1,
    targets: ["AED"],
  });

  const profileStore = createStore("profile-store", conversionProfile.value);
  conversionProfile.value = profileStore.get();
  watch(conversionProfile, (value) => {
    profileStore.set((entry: IConversionProfile) =>
      Object.assign(entry, value)
    );
  });
  const queryObj: { src: TCurrencyCodes; targets: string; amount: string } =
    Object.fromEntries(new URLSearchParams(location.search)) as {
      src: TCurrencyCodes;
      targets: string;
      amount: string;
    };
  if (queryObj.src && queryObj.targets && queryObj.amount) {
    conversionProfile.value.src = queryObj.src;
    conversionProfile.value.amount = Number.parseFloat(queryObj.amount);
    conversionProfile.value.targets = queryObj.targets.split(
      ","
    ) as TCurrencyCodes[];
  }

  return {
    conversionProfile,
  };
}
