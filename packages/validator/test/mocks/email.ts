export const validEmails = [
  'a@gmail.com',
  'b@g-mail.com',
  'd-d.c@gmail.com.org',
  '-lookout@gmail.com',
  '-@gmail.com',
  '^&*@gmail.com',
];

export const invalidEmails = [
  '@gmail.com',
  'notemail',
  'a@gmail',
  'b@',
  'cc@g_mail.com',
];

export const invalidEmailTypes = [
  123,
  Symbol(''),
  {},
  [],
  1n,
  function () {},
  true,
  false,
];
