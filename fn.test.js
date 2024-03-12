const fn = require("./fn");

test("3초 후에 에러가 납니다.", async () => {
  await expect(fn.getAge()).resolves.toBe(30);
});
