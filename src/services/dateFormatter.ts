export class DateFormatter {
  static getShortDateAndTime(date = new Date()) {
    return date.toLocaleDateString("ru-RU", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static getLongDate(date = new Date()) {
    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
