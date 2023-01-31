import { merge } from "object-mapper";
export class Transformers {
  static ArrayToString =
    (joiner = "\n") =>
    (value: any[]) => {
      return value.join(joiner);
    };
  static StringToArray =
    (delimiter: string | RegExp = /\r\n|\r|\n/) =>
    (value: string) => {
      return value.split(delimiter);
    };
  static ObjectToArray = () => (value: object | Array<any>) => {
    if (Array.isArray(value)) return value;
    return Object.values(value);
  };
}
export default class ObjectMapper {
  static map(srcObj: any, mapObj: any, excludes: string[] = []) {
    Object.keys(srcObj)
      .filter((k) => !excludes.includes(k))
      .filter((k) => !Object.keys(mapObj).includes(k))
      .forEach((k) => {
        mapObj[k] = k;
      });

    Object.keys(mapObj).forEach((k) => {
      const mapRule = mapObj[k];
      if (typeof mapRule == "function") {
        mapObj[k] = {
          key: k,
          transform: mapRule,
        };
      }
    });

    return merge(srcObj, mapObj);
  }
}
