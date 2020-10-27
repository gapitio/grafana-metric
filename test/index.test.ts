import { SOMETHING_VARIABLE, add, somethingFunction } from "../src/index";

describe("add", () => {
  it("adds correctly", () => {
    expect(add(2, 5)).toBe(7);
  });
});

describe("something", () => {
  it("is something", () => {
    expect(somethingFunction()).toBe("something");
    expect(SOMETHING_VARIABLE).toBe("something");
  });
});
