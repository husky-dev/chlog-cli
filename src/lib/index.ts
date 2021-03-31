import { existsSync, readFileSync, writeFileSync } from 'fs';
import { CliOpt, getArgsStrParam, Log, UnknownParsedArgs } from 'utils';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { Changelog } from './types';
import { argsToNewSectionItem, getSectionsWithVersion, mergeSections } from './utils';

const log = Log('changelog');

const defVersionParam = 'Unreleased';

export const processCmd = (cmd: string, args: UnknownParsedArgs, opt: CliOpt) => {
  if (cmd === 'get') {
    return processGetCmd(args, opt);
  }
  if (cmd === 'add') {
    return processAddCmd(args, opt);
  }
  return log.errAndExit(`Unknown command ${cmd}`);
};

const processGetCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsStrParam(args, ['version', 'v']);
  if (verParam) {
    const sections = getSectionsWithVersion(changelog, `${verParam}`);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog, { header: false }));
};

const processAddCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsStrParam(args, ['version', 'v']) || defVersionParam;

  const curVer = changelog.versions.find(itm => itm.name === verParam);
  if (!curVer) {
    changelog.versions.unshift({ name: verParam, sections: [] });
  }

  const newSection = argsToNewSectionItem(args);

  const versions = changelog.versions.map(version =>
    version.name !== verParam ? version : { ...version, sections: mergeSections([...version.sections, newSection]) },
  );

  writeChangelogToFile(opt, { ...changelog, versions });
};

// File

const readChangelogFromFile = (opt: CliOpt) => {
  if (!existsSync(opt.filePath)) {
    throw new Error(`changelog file not found at path "${opt.filePath}"`);
  }
  const str = readFileSync(opt.filePath, 'utf-8');
  return strToChangelog(str);
};

const writeChangelogToFile = (opt: CliOpt, changelog: Changelog) => {
  if (!existsSync(opt.filePath)) {
    throw new Error(`changelog file not found at path "${opt.filePath}"`);
  }
  const str = changelogToStr(changelog, { header: true, sortSections: true, sortItems: true });
  writeFileSync(opt.filePath, str, 'utf-8');
};
