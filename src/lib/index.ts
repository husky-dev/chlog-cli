import { existsSync, readFileSync, writeFileSync } from 'fs';
import { CliOpt, getArgsVersionParam, getArgsVersionParamOrErr, log, UnknownParsedArgs } from 'utils';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { Changelog } from './types';
import { argsToNewSectionItem, getSectionsWithVersion, mergeSections } from './utils';

const defVersionParam = 'Unreleased';

export const processCmd = (cmd: string, args: UnknownParsedArgs, opt: CliOpt) => {
  if (cmd === 'get') {
    return processGetCmd(args, opt);
  }
  if (cmd === 'add') {
    return processAddCmd(args, opt);
  }
  if (cmd === 'remove') {
    return processRemoveCmd(args, opt);
  }
  throw new Error(`Unknown command "${cmd}"`);
};

const processGetCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsVersionParam(args);
  if (verParam) {
    const sections = getSectionsWithVersion(changelog, `${verParam}`);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog, { header: false }));
};

const processAddCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsVersionParam(args) || defVersionParam;

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

const processRemoveCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);

  const verParam = getArgsVersionParamOrErr(args);

  const curVer = changelog.versions.find(itm => itm.name === verParam);
  if (!curVer) {
    throw new Error(`Version ${verParam} not found`);
  }

  const versions = changelog.versions.filter(itm => itm.name !== verParam);

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
