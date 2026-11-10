/** 把名字变成可用作 JS 标识符的形式（不追求规范，能编译即可） */
export const toIdent = (name: string) => {
  if (/^[A-Za-z_$][\w$]*$/.test(name)) return name;
  const cleaned = name.replace(/\W/g, '_');
  return /^[A-Za-z_$]/.test(cleaned) ? cleaned : `_${cleaned}`;
};
