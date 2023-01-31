export default class StringUtils {
  /**
   * Capitalize the first letter of {@link str}
   * @param str
   */
  static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static toSnakeCase(str: string): string {
    return (
      (str &&
        str
          .match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
          )
          ?.map((x) => x.toLowerCase())
          .join("_")) ??
      str
    );
  }
}
