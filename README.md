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

## 테스트 전후 작업

```js
let num = 0;

test("0 더하기 1 은 1 이다.", () => {
  num = fn.add(num, 1);
  expect(num).toBe(1);
});

test("0 더하기 2  은 2 이다.", () => {
  num = fn.add(num, 2);
  expect(num).toBe(2);
});

test("0 더하기 3 은 3 이다.", () => {
  num = fn.add(num, 3);
  expect(num).toBe(3);
});

test("0 더하기 4 은 4 이다.", () => {
  num = fn.add(num, 4);
  expect(num).toBe(4);
});

결과:
√ 0 더하기 1 은 1 이다. (2 ms)
× 0 더하기 2  은 2 이다. (2 ms)
× 0 더하기 3 은 3 이다.
× 0 더하기 4 은 4 이다.

문제: num이 새로운 값으로 할당 됨

해결:
beforeEach(() => {
  num = 0;
});
beforeEach를 사용함으로써 테스트 실행 전 num이 0으로 할당되기 떄문


let num = 10;

afterEach(() => {
  num = 0;
});

test("0 더하기 1 은 1 이다.", () => {
  num = fn.add(num, 1);
  expect(num).toBe(1);
});

test("0 더하기 2  은 2 이다.", () => {
  num = fn.add(num, 2);
  expect(num).toBe(2);
});

test("0 더하기 3 은 3 이다.", () => {
  num = fn.add(num, 3);
  expect(num).toBe(3);
});

test("0 더하기 4 은 4 이다.", () => {
  num = fn.add(num, 4);
  expect(num).toBe(4);
});

결과:
  × 0 더하기 1 은 1 이다. (4 ms)
  √ 0 더하기 2  은 2 이다.
  √ 0 더하기 3 은 3 이다.
  √ 0 더하기 4 은 4 이다. (1 ms)

문제: afterEach는 테스트가 끝난 후에 num을 0으로 할당
```

and

`db 사용 예시`

```js
const fn = {
  add: (num1, num2) => num1 + num2,
  connectUserDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res({
          name: "Mike",
          age: 30,
          gender: "male",
        });
      }, 500);
    });
  },
  disConnectDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 500);
    });
  },
};

// Test
let user;

beforeEach(async () => {
  user = await fn.connectUserDb();
});

afterEach(() => {
  return fn.disConnectDb();
});

test("이름은 Mike", () => {
  expect(user.name).toBe("Mike");
});
test("나이는 30", () => {
  expect(user.age).toBe(30);
});
test("성별은 남성", () => {
  expect(user.gender).toBe("male");
});
 -> Pass가 되지만 테스트가 시작,끝나는 구간마다 연결 및 끊음을 반복하여 시간이 오래걸림
 해결: 처음시작시에 한 번만 가져오고 모든 작업이 끝난 후 열결 끊음
 beforeAll(async () => {
  user = await fn.connectUserDb();
});
afterAll(() => {
  return fn.disConnectDb();
});
을 사용하여서 해결

and

const fn = {
  add: (num1, num2) => num1 + num2,
  connectUserDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res({
          name: "Mike",
          age: 30,
          gender: "male",
        });
      }, 500);
    });
  },
  disConnectDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 500);
    });
  },
  connectCarDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res({
          brand: "bmw",
          name: "z4",
          color: "red",
        });
      }, 500);
    });
  },
  disConnectCarDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 500);
    });
  },
};
-> Car라는 정보를 추가

// Test
let user;

beforeAll(async () => {
  user = await fn.connectUserDb();
});

afterAll(() => {
  return fn.disConnectDb();
});

test("이름은 Mike", () => {
  expect(user.name).toBe("Mike");
});
test("나이는 30", () => {
  expect(user.age).toBe(30);
});
test("성별은 남성", () => {
  expect(user.gender).toBe("male");
});

describe("Car 관련 작업", () => {
  let car;

  beforeAll(async () => {
    car = await fn.connectCarDb();
  });

  afterAll(() => {
    return fn.disConnectCarDb();
  });

  test("Car 브랜드는 bmw", () => {
    expect(car.brand).toBe("bmw");
  });
  test("Car 이름은 z4", () => {
    expect(car.name).toBe("z4");
  });
  test("Car 색상은 Red", () => {
    expect(car.color).toBe("red");
  });
});
-> describe('',()=>{})를 사용하여 분리
결과:
  √ 이름은 Mike (5 ms)
  √ 나이는 30 (1 ms)
  √ 성별은 남성
  Car 관련 작업
    √ Car 브랜드는 bmw (1 ms)
    √ Car 이름은 z4 (1 ms)
    √ Car 색상은 Red (1 ms)

    and 순서 위치
beforeAll(() => console.log("밖 beforeAll")); //1
beforeEach(() => console.log("밖 beforeEach")); //2, 6
afterAll(() => console.log("밖 afterAll")); //4,10
afterEach(() => console.log("밖 afterEach")); //마지막

test("0 + 1 = 1", () => {
  expect(fn.add(0, 1)).toBe(1); //3
});

describe("Car관련 작업", () => {
  beforeAll(() => console.log("안 beforeAll")); //5
  beforeEach(() => console.log("안 beforeEach")); //7
  afterAll(() => console.log("안 afterAll")); //9
  afterEach(() => console.log("안 afterEach")); // 마지막 -1 (마지막에서 두번째)

  test("0 + 1 = 1", () => {
    expect(fn.add(0, 1)).toBe(1); //8
  });
});

  console.log
    밖 beforeAll

  console.log
    밖 beforeEach

  console.log
    밖 afterEach

  console.log
    안 beforeAll

  console.log
    밖 beforeEach

  console.log
    안 beforeEach

  console.log
    안 afterEach

  console.log
    밖 afterEach

  console.log
    안 afterAll

  console.log
    밖 afterAll

 and

 let num = 0;
test("0 더하기 1 은 1", () => {
  expect(fn.add(num, 1)).toBe(1);
});
test("0 더하기 2 은 2", () => {
  expect(fn.add(num, 2)).toBe(2);
});
test("0 더하기 3 은 3", () => {
  expect(fn.add(num, 3)).toBe(3);
});
test("0 더하기 1 은 4", () => {
  expect(fn.add(num, 4)).toBe(4);
  num = 10;
});
test.only("0 더하기 1 은 5", () => {
  expect(fn.add(num, 5)).toBe(5);
});
-> 마지막 테스트에서 실패
->`only`를 사용해서 마지막 테스트만 확인 후 문제 테스트 코드에는 문제가 없는 걸 발견

test.skip("0 더하기 1 은 4", () => {
  expect(fn.add(num, 4)).toBe(4);
  num = 10;
});
-> `skip`을 사용해서 `skip`을 사용한 테스트를 제외한 나머지를 테스트
```
