import { DateFormatter } from "../services/dateFormatter.js";

describe("Date formatter", () => {
  const date = new Date("2026-03-24T11:45:00");
  it("should format date to short format", () => {
    const shortDate = DateFormatter.getShortDateAndTime(date);

    expect(shortDate).toContain("24");
    expect(shortDate.toLowerCase()).toContain("мар");
    expect(shortDate).toMatch(/\d{2}:\d{2}/);
  });

  it("should format date to long format", () => {
    const longDate = DateFormatter.getLongDate(date);

    expect(longDate.toLowerCase()).toContain("март");
    expect(longDate).toContain("2026");
    expect(longDate).toContain("24");
    expect(longDate).not.toMatch(/\d{2}:\d{2}/);
    expect(longDate.toLowerCase()).toContain("вторник");
  });
});
