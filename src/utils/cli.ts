import { LogLevel } from './log';

export interface UnknownParsedArgs {
  [arg: string]: unknown;
  /** If opts['--'] is true, populated with everything after the -- */
  '--'?: string[];
  /**  Contains all the arguments that didn't have an option associated with them */
  _: string[];
}

export interface CLIOpts {
  cwd: string;
  logLevel: LogLevel;
}

export const getArgsStrParam = (args: UnknownParsedArgs, names: string[]): string | undefined => {
  for (const name of names) {
    const val: unknown = args[name];
    if (typeof val === 'string' || typeof val === 'number') {
      return `${val}`;
    }
  }
  return undefined;
};
