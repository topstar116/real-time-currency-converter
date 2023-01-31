import Axios from "axios";

describe("axios", () => {
  it("outisnemo.com", async () => {
    const res = await Axios.get(
      "https://outisnemo.com/minimal-currency-converter/"
    );
    console.log(res);
  });
});
