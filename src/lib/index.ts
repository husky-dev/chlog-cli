import { existsSync, readFileSync } from 'fs';
import { getArgsStrParam, Log, UnknownParsedArgs } from 'utils';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { getSectionsWithVersion } from './utils';

const log = Log('changelog');

export const getChangelog = (cwd: string, args: UnknownParsedArgs) => {
  const str = getChangelogStr(cwd);
  const changelog = strToChangelog(str);
  const verParam = getArgsStrParam(args, ['version', 'v']);
  if (verParam) {
    const sections = getSectionsWithVersion(changelog, `${verParam}`);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog, { header: false }));
};

// File

const getChangelogStr = (cwd: string) => {
  const filePath = `${cwd}/CHANGELOG.md`;
  if (!existsSync(filePath)) {
    throw new Error(`changelog file not found at path "${filePath}"`);
  }
  return readFileSync(filePath, 'utf-8');
};
