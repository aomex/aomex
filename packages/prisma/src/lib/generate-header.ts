export const generateHeader = () => {
  return `
  import { rule } from "@aomex/common";
  
  function pick(obj, ...keys) {
    const subObj = {};
    for (const key of keys) {
      if (Object.hasOwn(obj, key)) {
        subObj[key] = obj[key];
      }
    }
    return subObj;
  }

  function omit(obj, ...keys) {
    return pick(obj, ...Object.keys(obj).filter((key) => !keys.includes(key)));
  }
  `;
};
