import { DateTimeFormatter, Duration, LocalDateTime } from "@js-joda/core";
import { merge } from "object-mapper";
import ObjectMapper from "@/utils/ObjectMapper";

describe("object-mapper", () => {
  it("simple", () => {
    const source = {
      apiKeys: [
        "15e0a8fb77f44c73baeb1614e548c284",
        "0ca0c602c38049cb90cbe09a1a70eb75",
      ],
      enableHistoricalReporting: true,
      preferredApi: "OpenExchange",
      updateFrequency: 60,
      wordMarkingRules: [],
    };

    const dest = {};
    const dest1 = merge<{ [key: string]: any }>(source, dest, {
      apiKeys: {
        key: "apiKeys",
        transform: (value: string[]) => {
          return value.join("\n");
        },
      },
    });

    console.log(
      ObjectMapper.map(source, {
        apiKeys: (value: string[]) => {
          return value.join("\n");
        },
      })
    );
    //console.log(JSON.stringify(dest1));
  });

  it("duration to seconds", () => {
    expect(Duration.ofMinutes(3).seconds() == 180);
  });
});
