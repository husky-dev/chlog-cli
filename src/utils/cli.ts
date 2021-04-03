import { last } from './types';

export interface UnknownParsedArgs {
  [arg: string]: unknown;
  /** If opts['--'] is true, populated with everything after the -- */
  '--'?: string[];
  /**  Contains all the arguments that didn't have an option associated with them */
  _: string[];
}

export interface CliOpt {
  filePath: string;
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

export const getArgsBoolParam = (args: UnknownParsedArgs, names: string[]): boolean | undefined => {
  for (const name of names) {
    const val: unknown = args[name];
    if (typeof val === 'boolean') {
      return val;
    }
  }
  return undefined;
};

export const getArgsVersionParam = (args: UnknownParsedArgs): string | undefined => getArgsStrParam(args, ['version', 'v']);

export const getArgsVersionParamOrErr = (args: UnknownParsedArgs): string => {
  const v = getArgsVersionParam(args);
  if (!v) {
    throw new Error('Version param required');
  }
  return v;
};

export const isArgsHelpRequest = (args: UnknownParsedArgs): boolean => {
  if (last(args._) === 'help') {
    return true;
  }
  if (getArgsBoolParam(args, ['help', 'h'])) {
    return true;
  }
  return false;
};
