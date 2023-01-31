import { DateTimeFormatter, LocalDate } from "@js-joda/core";
import { __DATE_FORMAT_STRING__ } from "@/global";

export default class DateUtils {
  static defaultDateFormatter = DateTimeFormatter.ofPattern(
    __DATE_FORMAT_STRING__
  );

  static parse(
    dateStr: string,
    formatter: DateTimeFormatter = DateUtils.defaultDateFormatter
  ) {
    return LocalDate.parse(dateStr, formatter);
  }

  static toString(
    date: LocalDate,
    formatter: DateTimeFormatter = DateUtils.defaultDateFormatter
  ): string {
    return date.format(formatter);
  }
}
