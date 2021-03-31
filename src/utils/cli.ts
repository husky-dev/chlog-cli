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
