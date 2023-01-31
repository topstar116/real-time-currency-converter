import XRegExp from "xregexp";

describe("regex", () => {
  it("match", () => {
    const regex = /^([+-])(\d+)/g;
    const str = `+223`;
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
      });
    }
  });

  it("Recognize currency symbol、code and amount", () => {
    const regex = XRegExp(
      "(?<symbol>\\p{Sc}{1})\\p{Zs}*(?<amount>[\\d,]+(\\.\\d+)?)"
    );
    const str1 = `$123`;
    const str2 = `¥123.1`;
    const str3 = `£1,234.1`;
    const match1 = XRegExp.exec(str1, regex);
    if (match1) {
      expect(
        (match1.groups ? match1.groups["symbol"] : "") == "$"
      ).toBeTruthy();
      expect(
        (match1.groups ? match1.groups["amount"] : "") == "123"
      ).toBeTruthy();
      /*console.log(
        `currency symbol:${match.groups ? match.groups["symbol"] : ""}`
      );
      console.log(`amount:${match.groups ? match.groups["amount"] : 0}`);*/
    }

    const match2 = XRegExp.exec(str2, regex);
    if (match2) {
      expect(
        (match2.groups ? match2.groups["symbol"] : "") == "¥"
      ).toBeTruthy();
      expect(
        (match2.groups ? match2.groups["amount"] : "") == "123.1"
      ).toBeTruthy();
      /*console.log(
        `currency symbol:${match.groups ? match.groups["symbol"] : ""}`
      );
      console.log(`amount:${match.groups ? match.groups["amount"] : 0}`);*/
    }

    const match3 = XRegExp.exec(str3, regex);
    if (match3) {
      expect(
        (match3.groups ? match3.groups["symbol"] : "") == "£"
      ).toBeTruthy();
      expect(
        (match3.groups ? match3.groups["amount"] : "") == "1,234.1"
      ).toBeTruthy();
      /*console.log(
        `currency symbol:${match.groups ? match.groups["symbol"] : ""}`
      );
      console.log(`amount:${match.groups ? match.groups["amount"] : 0}`);*/
    }
  });
});
