/* eslint-disable no-console */
export enum LogLevel {
  none = -1,
  err = 0,
  warn = 1,
  info = 2,
  debug = 3,
  trace = 4,
}

export const Log = (m: string, defLevel: LogLevel = LogLevel.trace) => {
  let level: LogLevel = defLevel;

  const setLevel = (val: LogLevel) => (level = val);

  return {
    err: (...args: unknown[]) => (level >= LogLevel.err ? console.log(`[x][${m}]:`, ...args) : undefined),
    warn: (...args: unknown[]) => (level >= LogLevel.warn ? console.log(`[!][${m}]:`, ...args) : undefined),
    info: (...args: unknown[]) => (level >= LogLevel.info ? console.log(`[+][${m}]:`, ...args) : undefined),
    debug: (...args: unknown[]) => (level >= LogLevel.debug ? console.log(`[-][${m}]:`, ...args) : undefined),
    trace: (...args: unknown[]) => (level >= LogLevel.trace ? console.log(`[*][${m}]:`, ...args) : undefined),
    errAndExit: (...args: unknown[]) => {
      console.log(`[x][${m}]:`, ...args);
      process.exit(1);
    },
    simple: (...args: unknown[]) => console.log(...args),
    setLevel,
  };
};
