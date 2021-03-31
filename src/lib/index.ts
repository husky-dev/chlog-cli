import { existsSync, readFileSync } from 'fs';
import { ParsedArgs } from 'minimist';

import { CLIOpts } from '../utils/cli';
import { Log } from '../utils/log';
import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { getChangelogSectionsWithVersonNamePattern } from './utils';

const log = Log('changelog');

export const processChangelogCmd = (command: string[], args: ParsedArgs, { cwd, logLevel }: CLIOpts) => {
  try {
    log.setLevel(logLevel);
    if (command.length === 0) {
      return getChangelog(cwd, args);
    }
    if (command[0] === 'get') {
      return getChangelog(cwd, args);
    }
    throw new Error(`unknown changelog command "${command[0]}"`);
  } catch (err: unknown) {
    return log.errAndExit(err);
  }
};

export const getChangelog = (cwd: string, args: ParsedArgs) => {
  const str = getChangelogStr(cwd);
  const changelog = strToChangelog(str);
  const verParam = getArgsStrParam(args, ['version', 'v']);
  if (verParam) {
    const sections = getChangelogSectionsWithVersonNamePattern(changelog, `${verParam}`);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog));
};

const getArgsStrParam = (args: ParsedArgs, names: string[]): string | undefined => {
  for (const name of names) {
    const val: unknown = args[name];
    if (typeof val === 'string' || typeof val === 'number') {
      return `${val}`;
    }
  }
  return undefined;
};

// File

const getChangelogStr = (cwd: string) => {
  const filePath = `${cwd}/CHANGELOG.md`;
  if (!existsSync(filePath)) {
    throw new Error(`changelog file not found at path "${filePath}"`);
  }
  return readFileSync(filePath, 'utf-8');
};
