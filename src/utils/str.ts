import { isBool, isErr, isNull, isNum, isStr, isUndef } from './types';

export const pad = (val: number, length: number): string => {
  let str: string = `${val}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
};

export const errToStr = (val: unknown): string => {
  if (isErr(val)) {
    return val.message;
  }
  if (isStr(val) || isNum(val)) {
    return `${val}`;
  }
  if (isBool(val)) {
    return val ? 'true' : 'false';
  }
  if (isNull(val) || isUndef(val)) {
    return '';
  }
  return '';
};
