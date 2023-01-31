import StringUtils from "@/utils/StringUtils";

describe("string", () => {
  it("capitalizeFirst", () => {
    expect(StringUtils.capitalizeFirst("zhCN")).toBe("ZhCN");
  });
});
