import { pad } from './str';

export const dateToFormatedStr = (v: Date): string => {
  const y = v.getFullYear();
  const m = v.getMonth() + 1;
  const d = v.getDate();
  return `${y}-${pad(m, 2)}-${pad(d, 2)}`;
};
