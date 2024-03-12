const fn = require("./fn");

test("에러나나요?", () => {
  expect(() => fn.throwErr()).toThrow("xx");
});
