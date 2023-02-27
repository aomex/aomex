export const invalidBigint = [
  Symbol(''),
  {},
  [],
  Buffer.from([]),
  function () {},
  true,
  false,
  'str',
  '123n',
];

export const looseBigint = [
  12345678,
  '1234567891111111111111',
  '0xffffffffff',
  '0b1111111',
];
