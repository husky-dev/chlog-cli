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
