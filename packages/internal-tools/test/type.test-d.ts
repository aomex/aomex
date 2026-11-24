import { expectType, type TypeEqual } from 'ts-expect';
import type { Exact, Prettify, Union2Intersection, IsUnion } from '../src';

// —— Exact：原始类型（含字面量收窄）——
{
  expectType<TypeEqual<'x', Exact<string, 'x'>>>(true);
  expectType<TypeEqual<string, Exact<string, string>>>(true);
  expectType<TypeEqual<1, Exact<number, 1>>>(true);
  expectType<TypeEqual<true, Exact<boolean, true>>>(true);
  expectType<TypeEqual<false, Exact<boolean, false>>>(true);
  expectType<TypeEqual<1n, Exact<bigint, 1n>>>(true);
  expectType<TypeEqual<null, Exact<null, null>>>(true);
  expectType<TypeEqual<undefined, Exact<undefined, undefined>>>(true);
}

// —— Exact：封闭对象多余键 → never ——
{
  type Expected = { id: number };
  expectType<
    TypeEqual<
      { id: number; extra: never },
      Exact<Expected, { id: number; extra: boolean }>
    >
  >(true);
  expectType<TypeEqual<{ id: number }, Exact<Expected, { id: number }>>>(true);
  expectType<
    TypeEqual<
      { id: number; a: never; b: never },
      Exact<Expected, { id: number; a: 1; b: 'x' }>
    >
  >(true);
}

// —— Exact：空对象 ——
{
  expectType<TypeEqual<{}, Exact<{}, {}>>>(true);
  expectType<TypeEqual<{ x: never }, Exact<{}, { x: 1 }>>>(true);
}

// —— Exact：可选 / 必填混排 ——
{
  type Expected = { id: number; name?: string; age?: number };
  expectType<TypeEqual<{ id: number }, Exact<Expected, { id: number }>>>(true);
  expectType<
    TypeEqual<{ id: number; name: string }, Exact<Expected, { id: number; name: string }>>
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string; age: number },
      Exact<Expected, { id: number; name: string; age: number }>
    >
  >(true);
  expectType<
    TypeEqual<{ id: number; extra: never }, Exact<Expected, { id: number; extra: true }>>
  >(true);
}

// —— Exact：嵌套对象（多层）——
{
  type Expected = { user: { id: number; profile: { bio: string } } };
  expectType<
    TypeEqual<
      { user: { id: number; profile: { bio: string } } },
      Exact<Expected, { user: { id: number; profile: { bio: string } } }>
    >
  >(true);
  expectType<
    TypeEqual<
      { user: { id: number; profile: { bio: string; x: never } } },
      Exact<Expected, { user: { id: number; profile: { bio: string; x: 1 } } }>
    >
  >(true);
  expectType<
    TypeEqual<
      { user: { id: number; extra: never; profile: { bio: string } } },
      Exact<Expected, { user: { id: number; extra: true; profile: { bio: string } } }>
    >
  >(true);
}

// —— Exact：对象内原始联合 / 字面量联合 ——
{
  type Expected = { status: 'ok' | 'fail'; flag: boolean };
  expectType<
    TypeEqual<{ status: 'ok'; flag: true }, Exact<Expected, { status: 'ok'; flag: true }>>
  >(true);
  expectType<
    TypeEqual<
      { status: 'ok'; flag: true; extra: never },
      Exact<Expected, { status: 'ok'; flag: true; extra: 1 }>
    >
  >(true);
}

// —— Exact：null / undefined / 联合 ——
{
  expectType<TypeEqual<null, Exact<null, null>>>(true);
  expectType<TypeEqual<undefined, Exact<undefined, undefined>>>(true);
  expectType<TypeEqual<null, Exact<string | null, null>>>(true);
  expectType<TypeEqual<'a', Exact<string | null, 'a'>>>(true);
  expectType<TypeEqual<undefined, Exact<string | undefined, undefined>>>(true);
  expectType<TypeEqual<'a', Exact<string | undefined, 'a'>>>(true);
  expectType<TypeEqual<null, Exact<string | null | undefined, null>>>(true);
  expectType<TypeEqual<undefined, Exact<string | null | undefined, undefined>>>(true);

  type WithNull = { id: number; note: string | null };
  expectType<
    TypeEqual<{ id: number; note: null }, Exact<WithNull, { id: number; note: null }>>
  >(true);
  expectType<
    TypeEqual<{ id: number; note: string }, Exact<WithNull, { id: number; note: string }>>
  >(true);
  expectType<
    TypeEqual<
      { id: number; note: string; x: never },
      Exact<WithNull, { id: number; note: string; x: 1 }>
    >
  >(true);

  type WithUndef = { id: number; name?: string | undefined };
  expectType<TypeEqual<{ id: number }, Exact<WithUndef, { id: number }>>>(true);
  expectType<
    TypeEqual<
      { id: number; name: undefined },
      Exact<WithUndef, { id: number; name: undefined }>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string },
      Exact<WithUndef, { id: number; name: string }>
    >
  >(true);

  type WithBoth = { tag: string | null | undefined };
  expectType<TypeEqual<{ tag: null }, Exact<WithBoth, { tag: null }>>>(true);
  expectType<TypeEqual<{ tag: undefined }, Exact<WithBoth, { tag: undefined }>>>(true);
  expectType<TypeEqual<{ tag: string }, Exact<WithBoth, { tag: string }>>>(true);
  expectType<TypeEqual<{ tag: null; x: never }, Exact<WithBoth, { tag: null; x: 1 }>>>(
    true,
  );

  // 嵌套可空对象
  type NestedNull = { user: { bio: string } | null };
  expectType<TypeEqual<{ user: null }, Exact<NestedNull, { user: null }>>>(true);
  expectType<
    TypeEqual<{ user: { bio: string } }, Exact<NestedNull, { user: { bio: string } }>>
  >(true);
  expectType<
    TypeEqual<
      { user: { bio: string; x: never } },
      Exact<NestedNull, { user: { bio: string; x: 1 } }>
    >
  >(true);

  // 嵌套可选对象（undefined 联合）
  type NestedUndef = { user: { bio: string } | undefined };
  expectType<TypeEqual<{ user: undefined }, Exact<NestedUndef, { user: undefined }>>>(
    true,
  );
  expectType<
    TypeEqual<
      { user: { bio: string; x: never } },
      Exact<NestedUndef, { user: { bio: string; x: 1 } }>
    >
  >(true);

  // 对象 | null | undefined 三态
  type NestedBoth = { user: { bio: string } | null | undefined };
  expectType<TypeEqual<{ user: null }, Exact<NestedBoth, { user: null }>>>(true);
  expectType<TypeEqual<{ user: undefined }, Exact<NestedBoth, { user: undefined }>>>(
    true,
  );
  expectType<
    TypeEqual<
      { user: { bio: string; x: never } },
      Exact<NestedBoth, { user: { bio: string; x: 1 } }>
    >
  >(true);

  // 两个对象支的联合：按成员分别精确匹配（多余键落到 never）
  type ObjUnion = { a: 1 } | { b: 2 };
  expectType<TypeEqual<{ a: 1 } | { a: never }, Exact<ObjUnion, { a: 1 }>>>(true);
  expectType<
    TypeEqual<
      { a: 1; x: never } | { a: never; x: never },
      Exact<ObjUnion, { a: 1; x: 1 }>
    >
  >(true);
}

// —— Exact：各种 & / | 组合 ——
{
  type A = { a: number };
  type B = { b: string };
  type C = { c: boolean };

  // A & B
  type AB = A & B;
  expectType<TypeEqual<{ a: number; b: string }, Exact<AB, { a: number; b: string }>>>(
    true,
  );
  expectType<
    TypeEqual<
      { a: number; b: string; x: never },
      Exact<AB, { a: number; b: string; x: 1 }>
    >
  >(true);

  // A & B & C
  type ABC = A & B & C;
  expectType<
    TypeEqual<
      { a: number; b: string; c: boolean },
      Exact<ABC, { a: number; b: string; c: boolean }>
    >
  >(true);
  expectType<
    TypeEqual<
      { a: number; b: string; c: boolean; z: never },
      Exact<ABC, { a: number; b: string; c: boolean; z: true }>
    >
  >(true);

  // (A & B) | null
  type ABNull = AB | null;
  expectType<TypeEqual<null, Exact<ABNull, null>>>(true);
  expectType<
    TypeEqual<{ a: number; b: string }, Exact<ABNull, { a: number; b: string }>>
  >(true);
  expectType<
    TypeEqual<
      { a: number; b: string; x: never },
      Exact<ABNull, { a: number; b: string; x: 1 }>
    >
  >(true);

  // (A & B) | undefined
  type ABUndef = AB | undefined;
  expectType<TypeEqual<undefined, Exact<ABUndef, undefined>>>(true);
  expectType<
    TypeEqual<
      { a: number; b: string; x: never },
      Exact<ABUndef, { a: number; b: string; x: 1 }>
    >
  >(true);

  // (A & B) | null | undefined
  type ABBoth = AB | null | undefined;
  expectType<TypeEqual<null, Exact<ABBoth, null>>>(true);
  expectType<TypeEqual<undefined, Exact<ABBoth, undefined>>>(true);
  expectType<
    TypeEqual<
      { a: number; b: string; x: never },
      Exact<ABBoth, { a: number; b: string; x: 1 }>
    >
  >(true);

  // 字段值为交叉 / 联合
  type NestedAnd = { x: A & B };
  expectType<
    TypeEqual<
      { x: { a: number; b: string } },
      Exact<NestedAnd, { x: { a: number; b: string } }>
    >
  >(true);
  expectType<
    TypeEqual<
      { x: { a: number; b: string; z: never } },
      Exact<NestedAnd, { x: { a: number; b: string; z: 1 } }>
    >
  >(true);

  type NestedOr = { x: A | B };
  // 字段是对象联合：子对象按成员精确匹配
  expectType<TypeEqual<{ x: { a: 1 } | { a: never } }, Exact<NestedOr, { x: { a: 1 } }>>>(
    true,
  );
  expectType<
    TypeEqual<
      { x: { a: 1; z: never } | { a: never; z: never } },
      Exact<NestedOr, { x: { a: 1; z: true } }>
    >
  >(true);

  // 字段为 (A & B) | null —— 去掉 null 后是交叉，仍精确匹配
  type NestedAndNull = { x: (A & B) | null };
  expectType<TypeEqual<{ x: null }, Exact<NestedAndNull, { x: null }>>>(true);
  expectType<
    TypeEqual<
      { x: { a: number; b: string; z: never } },
      Exact<NestedAndNull, { x: { a: number; b: string; z: 1 } }>
    >
  >(true);

  // 判别联合：合法成员可赋值；多余键在各支上为 never
  type Diff = { kind: 'a'; a: number } | { kind: 'b'; b: string };
  type DiffOk = Exact<Diff, { kind: 'a'; a: 1 }>;
  expectType<TypeEqual<true, { kind: 'a'; a: 1 } extends DiffOk ? true : false>>(true);
  type DiffBad = Exact<Diff, { kind: 'a'; a: 1; x: true }>;
  expectType<
    TypeEqual<false, { kind: 'a'; a: 1; x: true } extends DiffBad ? true : false>
  >(true);

  // (A | B) & { id: number } —— 合法成员可通过
  type IdA = { id: number } & A;
  type IdB = { id: number } & B;
  type IdUnion = IdA | IdB;
  type IdOk = Exact<IdUnion, { id: 1; a: 2 }>;
  expectType<TypeEqual<true, { id: 1; a: 2 } extends IdOk ? true : false>>(true);

  // 交叉里带可选
  type Mix = { id: number } & { name?: string } & { tag: string | null };
  expectType<TypeEqual<{ id: number; tag: null }, Exact<Mix, { id: number; tag: null }>>>(
    true,
  );
  expectType<
    TypeEqual<
      { id: number; name: string; tag: string },
      Exact<Mix, { id: number; name: string; tag: string }>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; tag: null; extra: never },
      Exact<Mix, { id: number; tag: null; extra: true }>
    >
  >(true);

  // Omit / Pick 作用在交叉与联合上
  type PickedAB = Pick<A & B, 'a'>;
  expectType<TypeEqual<{ a: number }, Exact<PickedAB, { a: number }>>>(true);
  expectType<TypeEqual<{ a: number; b: never }, Exact<PickedAB, { a: number; b: 'x' }>>>(
    true,
  );

  type OmittedDiff = Omit<{ kind: 'a'; a: number; secret: string }, 'secret'>;
  expectType<
    TypeEqual<{ kind: 'a'; a: number }, Exact<OmittedDiff, { kind: 'a'; a: number }>>
  >(true);
  expectType<
    TypeEqual<
      { kind: 'a'; a: number; secret: never },
      Exact<OmittedDiff, { kind: 'a'; a: number; secret: 'x' }>
    >
  >(true);
}

// —— Exact：数组 / 元组逐元素精确匹配 ——
{
  expectType<TypeEqual<number[], Exact<number[], number[]>>>(true);
  expectType<TypeEqual<[1, 2], Exact<number[], [1, 2]>>>(true);
  expectType<TypeEqual<string[], Exact<string[], string[]>>>(true);
  // 数组元素为对象：多余键变成 never
  type Rows = { id: number }[];
  expectType<
    TypeEqual<{ id: number; x: never }[], Exact<Rows, { id: number; x: boolean }[]>>
  >(true);
  expectType<
    TypeEqual<{ items: number[] }, Exact<{ items: number[] }, { items: number[] }>>
  >(true);
  type Row = { id: number };
  expectType<TypeEqual<{ rows: Row[] }, Exact<{ rows: Row[] }, { rows: Row[] }>>>(true);
  expectType<
    TypeEqual<
      { rows: { id: number; x: never }[] },
      Exact<{ rows: Row[] }, { rows: { id: number; x: boolean }[] }>
    >
  >(true);
}

// —— Exact：索引签名（开放对象）不拦截 ——
{
  type Open = { [k: string]: number };
  expectType<TypeEqual<{ a: 1; b: 2 }, Exact<Open, { a: 1; b: 2 }>>>(true);

  type OpenPartial = { id: number; [k: string]: number | string };
  expectType<TypeEqual<{ id: 1; name: 'x' }, Exact<OpenPartial, { id: 1; name: 'x' }>>>(
    true,
  );
}

// —— Exact：Date / Function / Promise 等非封闭对象不误伤 ——
{
  expectType<TypeEqual<Date, Exact<Date, Date>>>(true);
  const d = new Date();
  expectType<TypeEqual<typeof d, Exact<Date, typeof d>>>(true);

  type Fn = () => void;
  expectType<TypeEqual<Fn, Exact<Fn, Fn>>>(true);
  expectType<TypeEqual<Promise<number>, Exact<Promise<number>, Promise<number>>>>(true);
}

// —— Exact：交叉类型封闭对象 ——
{
  type Expected = { id: number } & { name: string };
  expectType<
    TypeEqual<{ id: number; name: string }, Exact<Expected, { id: number; name: string }>>
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string; extra: never },
      Exact<Expected, { id: number; name: string; extra: true }>
    >
  >(true);
}

// —— Exact：与 Omit / Pick 组合 ——
{
  type Full = { id: number; name: string; email: string; age?: number };
  type Picked = Pick<Full, 'id' | 'name'>;
  type Omitted = Omit<Full, 'email' | 'age'>;

  expectType<TypeEqual<Picked, Exact<Picked, { id: number; name: string }>>>(true);
  expectType<
    TypeEqual<
      { id: number; name: string; email: never },
      Exact<Picked, { id: number; name: string; email: string }>
    >
  >(true);

  expectType<TypeEqual<Omitted, Exact<Omitted, { id: number; name: string }>>>(true);
  expectType<
    TypeEqual<
      { id: number; name: string; age: never },
      Exact<Omitted, { id: number; name: string; age: 1 }>
    >
  >(true);

  // 对 Full 做 Omit 后再 Exact：仍禁止未 omit 掉的键以外的多余字段
  type WithoutEmail = Omit<Full, 'email'>;
  expectType<
    TypeEqual<
      { id: number; name: string },
      Exact<WithoutEmail, { id: number; name: string }>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string; age: number },
      Exact<WithoutEmail, { id: number; name: string; age: number }>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; name: string; email: never },
      Exact<WithoutEmail, { id: number; name: string; email: string }>
    >
  >(true);
}

// —— Exact：嵌套 Omit/Pick ——
{
  type User = { id: number; profile: { bio: string; level: number } };
  type Slim = { id: number; profile: Omit<User['profile'], 'level'> };
  expectType<
    TypeEqual<
      { id: number; profile: { bio: string } },
      Exact<Slim, { id: number; profile: { bio: string } }>
    >
  >(true);
  expectType<
    TypeEqual<
      { id: number; profile: { bio: string; level: never } },
      Exact<Slim, { id: number; profile: { bio: string; level: 1 } }>
    >
  >(true);
}

// —— 顺带：其它 type 工具仍可用 ——
{
  expectType<TypeEqual<{ a: 1; b: { c: 2 } }, Prettify<{ a: 1 } & { b: { c: 2 } }>>>(
    true,
  );
  expectType<TypeEqual<{ a: 1 } & { b: 2 }, Union2Intersection<{ a: 1 } | { b: 2 }>>>(
    true,
  );
  expectType<TypeEqual<true, IsUnion<'a' | 'b'>>>(true);
  expectType<TypeEqual<false, IsUnion<'a'>>>(true);
  expectType<TypeEqual<false, IsUnion<{ a: number } & { b: string }>>>(true);
  expectType<TypeEqual<true, IsUnion<{ a: number } | { b: string }>>>(true);
}

/**
 * 可靠性：用与 slot / response / emit / formatError 相同的
 * `<R extends E>(value: Exact<E, R>)` 形态验收。
 * 合法必须通过；多余键 / 错类型必须报错（含变量、嵌套、联合成员、数组元素）。
 */
{
  const accept = <E, R extends E>(value: Exact<E, R>): void => {
    void value;
  };
  const acceptAsync = <E, R extends E>(
    value: Exact<E, R> | Promise<Exact<E, R>>,
  ): void => {
    void value;
  };
  type Send = {
    send<R extends { id: number; name?: string }>(
      body: Exact<{ id: number; name?: string }, R>,
    ): void;
    send<R extends { id: number; name?: string }>(
      event: 'evt',
      data: Exact<{ id: number; name?: string }, R>,
      options?: { except?: string },
    ): void;
  };
  const send = null as unknown as Send;

  type User = { id: number; name?: string; note: string | null };
  const acceptUser = <R extends User>(value: Exact<User, R>) => accept<User, R>(value);
  acceptUser({ id: 1, note: null });
  acceptUser({ id: 1, name: 'a', note: 'n' });
  acceptUser({ id: 0, name: undefined, note: null });
  // @ts-expect-error 缺 note
  acceptUser({ id: 1 });
  // @ts-expect-error 顶层多余
  acceptUser({ id: 1, note: null, extra: true });
  const wider = { id: 1, note: null as string | null, extra: true };
  // @ts-expect-error 变量带回多余键
  acceptUser(wider);

  type Nested = { user: { id: number; bio?: string } | null };
  const acceptNested = <R extends Nested>(value: Exact<Nested, R>) =>
    accept<Nested, R>(value);
  acceptNested({ user: null });
  acceptNested({ user: { id: 1 } });
  // @ts-expect-error 嵌套多余
  acceptNested({ user: { id: 1, x: 1 } });
  // @ts-expect-error user 不能 undefined
  acceptNested({ user: undefined });

  type And = { a: number } & { b: string };
  const acceptAnd = <R extends And>(value: Exact<And, R>) => accept<And, R>(value);
  acceptAnd({ a: 1, b: 'x' });
  // @ts-expect-error 交叉缺字段
  acceptAnd({ a: 1 });
  // @ts-expect-error 交叉多余
  acceptAnd({ a: 1, b: 'x', z: 1 });

  type Or = { a: number } | { b: string };
  const acceptOr = <R extends Or>(value: Exact<Or, R>) => accept<Or, R>(value);
  acceptOr({ a: 1 });
  acceptOr({ b: 'x' });
  // @ts-expect-error 联合成员多余键
  acceptOr({ a: 1, x: true });
  // @ts-expect-error 不能同时带上两个互斥成员的键
  acceptOr({ a: 1, b: 'x' });
  // @ts-expect-error 空对象
  acceptOr({});

  type Rows = { id: number }[];
  const acceptRows = <R extends Rows>(value: Exact<Rows, R>) => accept<Rows, R>(value);
  acceptRows([{ id: 1 }, { id: 2 }]);
  acceptRows([]);
  // @ts-expect-error 元素多余键
  acceptRows([{ id: 1, x: 1 }]);
  // @ts-expect-error 元素缺字段
  acceptRows([{}]);

  const acceptString = <R extends string>(value: Exact<string, R>) =>
    accept<string, R>(value);
  const acceptNumber = <R extends number>(value: Exact<number, R>) =>
    accept<number, R>(value);
  const acceptBoolean = <R extends boolean>(value: Exact<boolean, R>) =>
    accept<boolean, R>(value);
  const acceptNull = <R extends null>(value: Exact<null, R>) => accept<null, R>(value);
  acceptString('x');
  acceptNumber(0);
  acceptBoolean(false);
  acceptNull(null);
  // @ts-expect-error
  acceptString(1);
  // @ts-expect-error
  acceptNull(undefined);

  type Open = { [k: string]: number };
  const acceptOpen = <R extends Open>(value: Exact<Open, R>) => accept<Open, R>(value);
  acceptOpen({ a: 1, b: 2 });

  const acceptUserAsync = <R extends User>(
    value: Exact<User, R> | Promise<Exact<User, R>>,
  ) => acceptAsync<User, R>(value);
  acceptUserAsync({ id: 1, note: null });
  acceptUserAsync(Promise.resolve({ id: 1, note: null }));
  // @ts-expect-error async 同样禁多余键
  acceptUserAsync(Promise.resolve({ id: 1, note: null, extra: 1 }));

  send.send({ id: 1 });
  send.send({ id: 1, name: 'a' });
  send.send('evt', { id: 1, name: 'a' }, { except: 'c' });
  // @ts-expect-error 方法入参多余键
  send.send({ id: 1, extra: true });
  send.send('evt', {
    id: 1,
    // @ts-expect-error 带 options 的重载同样禁多余键
    extra: true,
  });
}
