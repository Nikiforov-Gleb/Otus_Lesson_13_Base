import { runApp } from "./runApp";

describe("Test runApp", () => {
  test("Insert h1 with text Hello word", () => {
    const element = document.createElement("div");
    runApp(element);
    expect(element.innerHTML).toContain("Hello word");
  });
});
