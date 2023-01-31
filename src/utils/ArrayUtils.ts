export default class ArrayUtils {
  static distinctByKey(key: string, arr: any[]) {
    return arr.filter((a, i) => arr.findIndex((s) => a[key] === s[key]) === i);
  }

  static randomItem(arr: Array<any>) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
