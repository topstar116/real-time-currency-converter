export default class MathUtils {
  static round(value: number, decimal: number): number {
    let rounded = value * Math.pow(10, decimal);
    rounded = Math.round(rounded);
    return rounded / Math.pow(10, decimal);
  }
}
