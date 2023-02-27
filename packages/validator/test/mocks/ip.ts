export const validIPv4 = [
  '127.0.0.1',
  '196.128.1.4',
  '255.255.255.255',
  '154.26.96.246',
];

export const validIPv6 = [
  '2001:0db8:3c4d:0015:0000:0000:1a2f:1a2b',
  '2031:0000:1F1F:0000:0000:0100:11A0:ADDF',
  '1080:0:0:0:8:800:200C:417A',
  '1080::8:800:200C:417A',
  'FF01::101',
  '::1',
  '::',
];

export const invalidIP = [
  '127.0.0.100000000',
  '256.255.255.255',
  '973.0.0.1',
  '25.2',
  '56.23.144',
  '127.0.555.4',
  '127.0.0.1 ',
  ' 127.0.0.1',
  'ok',
];

export const invalidIPv4 = invalidIP.concat(validIPv6);
export const invalidIPv6 = invalidIP.concat(validIPv4);

export const invalidIPTypes = [12223, {}, NaN, Infinity];
