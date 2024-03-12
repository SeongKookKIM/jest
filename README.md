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

`toBe`는 단순한 값 또는 숫자를 비교할때 사용
`.not`을 사용 할 경우 `false`일 경우 통과
```

## Matchers

```js
test("이름과 나이를 전달받아서 객체를 반환", () => {
  expect(fn.makeUser("Mike", 30)).toBe({
    name: "Mike",
    age: 30,
  });
}); -> //Error

객체 또는 배열은 `toBe`사용시 오류
`toBe` -> 원시타입
`toEqual` -> 객체 타입
```

and

```js
const fn = {
  add: (num1, num2) => num1 + num2,
  makeUser: (name, age) => ({ name, age, gender: undefined }),
};


test("이름과 나이를 전달받아서 객체를 반환", () => {
  expect(fn.makeUser("Mike", 30)).toEqual({
    name: "Mike",
    age: 30,
  });
}); ->//Pass

test("이름과 나이를 전달받아서 객체를 반환", () => {
  expect(fn.makeUser("Mike", 30)).toStrictEqual({
    name: "Mike",
    age: 30,
  });
}); ->//Error

`toEqual`-> pass
`toStrictEqual` -> error
더 정확하게 확인하기 위해선 `toStrictEqual`지양
```

and

```js
// toBeNull
// toBeUndefined
// toBeDefined

test("null은 null입니다.", () => {
  expect(null).toBeNull();
}); -> //Pass

// toBeTruthy
// toBeFalsy
test("0은 false 입니다..", () => {
  expect(fn.add(1, -1)).toBeFalsy();
}); -> //Pass

test("비어있지 않은 문자열은 true입니다.", () => {
  expect(fn.add("hello", "world")).toBeTruthy();
}); -> //Pass

`+추가`
느슨한 타입 기반 언어인 자바스크립트는, 자바같은 강한 타입 기반 언어처럼 true와 false가 boolean 타입에 한정되지 않는다.
따라서 숫자 1이 true로 간주되고, 숫자 0이 false로 간주되는 것과 같이,
모든 타입의 값들을 true 아니면 false 간주하는 규칙이 있는데, 
toBeTruthy() 는 검증 대상이 이 규칙에 따라 true로 간주되면 테스트 통과이고, 
toBeFalsy() 는 반대로 false로 간주되는 경우 테스트가 통과된다.

test("number 0 is falsy but string 0 is truthy", () => {
  expect(0).toBeFalsy(); // 숫자 0은 false를 의미하기도 하다. true
  expect("0").toBeTruthy(); // 문자열은 true를 의미하기도 하다. true
});

출처: https://inpa.tistory.com/entry/JEST-📚-jest-기본-문법-정리 [Inpa Dev 👨‍💻:티스토리]
```

and

```js
// toBeGreatThan 크다
// toBeGreatThanOrEqual 크거나 같다
// toBeLessThan 작다
// toBeLessThanOrEqual 작거나 같다

test("ID는 10자 이하여야 합니다.", () => {
  const id = "The_black_order";
  expect(id.length).toBeLessThanOrEqual(10);
}); ->//Error

Expected: <= 10
Received:    15

test("ID는 10자 이하여야 합니다.", () => {
  const id = "The_black";
  expect(id.length).toBeLessThanOrEqual(10);
}); ->//Pass

test("비밀번호 4자리.", () => {
  const pw = "1234";
  expect(pw.length).toBe(4);
}); ->//Pass

test("비밀번호 4자리.", () => {
  const pw = "1234";
  expect(pw.length).toEqual(4);
}); ->//Pass

test("0.1 더하기 0.2는 0.3입니다.", () => {
  expect(fn.add(0.1, 0.2)).toBe(0.3);
}); ->//Error 자바스크립트의 소숫점은 정확하지 않음

test("0.1 더하기 0.2는 0.3입니다.", () => {
  expect(fn.add(0.1, 0.2)).toBeCloseTo(0.3);
}); =>//Pass `toBeCloseTo`사용시 값이 가까운지 확인

test("Hello Wordl 에 a 라는 글자가 있나?", () => {
  expect("Hello Wordl").toMatch(/h/i);
}); ->//Pass `i`는 대-소문자를 무시

test("유저 리스트에 Mike가 존재하나?", () => {
  const user = "Mike";
  const userList = ["Tom", "Sam", "Kai"];
  expect(userList).toContain(user);
}); ->//Error `toHaveLength()` 배열의 길이를 체크할때 / `toContain()` 특정 원소가 배열에 존재하는지 확인할때

const fn = {
  add: (num1, num2) => num1 + num2,
  makeUser: (name, age) => ({ name, age, gender: undefined }),
  throwErr: () => {
    throw new Error("xx");
  },
}; -> 강제 에러 추가

test("에러나나요?", () => {
  expect(() => fn.throwErr()).toThrow();
}); ->//Pass

test("에러나나요?", () => {
  expect(() => fn.throwErr()).toThrow("oo");
}); ->//Error error에서 받아오는 값과 넣은 인수가 다름
```

## 비동기 코드 테스트

`callback  패턴`

```js
const fn = {
  add: (num1, num2) => num1 + num2,
  getName: (callback) => {
    const name = "Mike";
    setTimeout(() => {
      callback(name);
    }, 3000);
  },
}; -> 3초 후 name을 받는 callback함수 생성

test("3초 후에 받아온 이름은 Mike", () => {
  function callback(name) {
    expect(name).toBe("Mike");
  }
  fn.getName(callback);
}); ->//Pass 하지만 3초 후 실행이 아닌 바로 실행

test("3초 후에 받아온 이름은 Mike", () => {
  function callback(name) {
    expect(name).toBe("Tom");
  }
  fn.getName(callback);
}); ->//Pass 이름을 변경해도 통과되는 문제가 발생
//이유: 테스트가 항상 통과하는 이유는 비동기 콜백 함수 fn.getName(callback)가 테스트 케이스가 종료된 후에 실행되기 때문입니다. Jest는 기본적으로 비동기 코드의 완료를 기다리지 않고 테스트를 종료하며, 따라서 비동기 코드가 실행되기 전에 테스트가 이미 완료되어 통과된 것처럼 보일 수 있습니다.

test("3초 후에 받아온 이름은 Mike", (done) => {
  function callback(name) {
    expect(name).toBe("Tom");
    done();
  }
  fn.getName(callback);
}); ->//Error `done`콜백을 사용하여 테스트가 비동기 작업이 완료된 후에 종료될 수 있도록 할 수 있습니다.

const fn = {
  add: (num1, num2) => num1 + num2,
  getName: (callback) => {
    const name = "Mike";
    setTimeout(() => {
      //   callback(name);
      throw new Error("서버 에러...");
    }, 3000);
  },
}; -> 에러처리시

test("3초 후에 받아온 이름은 Mike", (done) => {
  function callback(name) {
    try {
      expect(name).toBe("Mike");
      done();
    } catch (error) {
      done();
    }
  }
  fn.getName(callback);
}); ->//Error trt-catch를 사용하여 Error를 처리함
```

`Promise 패턴`

```js
const fn = {
  add: (num1, num2) => num1 + num2,
  getName: (callback) => {
    const name = "Mike";
    setTimeout(() => {
      callback(name);
    }, 3000);
  },
  getAge: () => {
    const age = 30;
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(age);
      }, 3000);
    });
  },
}; -> 3초후에 나이를 받아오는 Promise 추가

test("3초 후에 받아온 나이는 30", () => {
  return fn.getAge().then((age) => {
    expect(age).toBe(30);
  });
}); ->//Pass 정상작동 ****꼭 return을 넣어줘야 정삭적으로 작동함

*resolves(성공) / rejects(실패) 사용
test("3초 후에 받아온 나이는 30", () => {
  //   return fn.getAge().then((age) => {
  //     expect(age).toBe(30);
  //   });
  return expect(fn.getAge()).resolves.toBe(30);
}); ->//pass 3초후 정상적으로 작동

  getAge: () => {
    const age = 30;
    return new Promise((res, rej) => {
      setTimeout(() => {
        // res(age);
        rej("error");
      }, 3000);
    });
  },-> 'error'값을 받는 error로 변경

  test("3초 후에 에러가 납니다.", () => {
  //   return fn.getAge().then((age) => {
  //     expect(age).toBe(30);
  //   });
  return expect(fn.getAge()).rejects.toMatch("error");
}); ->//Pass .toMatch()를 사용하여 `error`가 맞는지 확인함.
//.toBe(30)을 사용할시 Error
```

`async-await 패턴`

```js
const fn = {
  add: (num1, num2) => num1 + num2,
  getName: (callback) => {
    const name = "Mike";
    setTimeout(() => {
      callback(name);
    }, 3000);
  },
  getAge: () => {
    const age = 30;
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(age);
        // rej("error");
      }, 3000);
    });
  },
}; -> 다시 3초 후 age를 받아오게 변경

test("3초 후에 에러가 납니다.", async () => {
  const age = await fn.getAge();
  expect(age).toBe(30);
}); ->//Pass 3초 후 정상적으로 Pass됨

test("3초 후에 에러가 납니다.", async () => {
  await expect(fn.getAge()).resolves.toBe(30);
}); ->//Pass 정상 작동 async-await 에서도 resolves / rejects 사용 가능
```
