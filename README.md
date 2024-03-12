## Jest 테스트 코드 작성

```js
const fn = require("./fn");

test("1은 1", () => {
  expect(1).toBe(1);
});

test("2 + 3 = 5", () => {
  expect(fn.add(2, 3)).toBe(5);
});

test("3 + 3 = 5가 아니다.", () => {
  expect(fn.add(3, 3)).not.toBe(5);
});

[toBe]는 단순한 값 또는 숫자를 비교할때 사용
[.not]을 사용 할 경우 [false]일 경우 통과
```
