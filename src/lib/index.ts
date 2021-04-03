import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { CliOpt, log } from 'utils';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { Changelog } from './types';
import { defChangelogTemplate, getSectionsWithVersion } from './utils';

export const initCmd = (fileName: string | undefined) => {
  const filePath = resolve(process.cwd(), fileName || 'CHANGELOG.md');
  log.info(`creating a new changelog at "${filePath}"`);
  writeFileSync(filePath, defChangelogTemplate);
};

export const getCmd = (version: string | undefined) => {
  const filePath = resolve(process.cwd(), 'CHANGELOG.md');
  const changelog = readChangelogFromFile(filePath);
  if (version) {
    const sections = getSectionsWithVersion(changelog, version);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog, { header: false }));
};

/*

export const processCmd = (cmd: string, args: UnknownParsedArgs, opt: CliOpt) => {
  if (cmd === 'get') {
    return processGetCmd(args, opt);
  }
  if (cmd === 'add') {
    return processAddCmd(args, opt);
  }
  if (cmd === 'change') {
    return processChangeCmd(args, opt);
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
  const verParam = getArgsVersionParam(args) || defUnreleasedVersionName;

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

const processChangeCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsVersionParamOrErr(args);
  const newNameParam = getArgsStrParam(args, ['name', 'n']);
  const newDateParam = getArgsStrParam(args, ['date', 'd']);

  if (!newNameParam && !newDateParam) {
    throw new Error('Name or date param required');
  }

  const curVer = changelog.versions.find(itm => itm.name === verParam);
  if (!curVer) {
    throw new Error(`Version "${verParam}" not found`);
  }

  const versions = changelog.versions.map(version => {
    if (version.name !== verParam) {
      return version;
    }
    let newVersion: Version = version;
    if (newNameParam) {
      newVersion = { ...newVersion, name: newNameParam };
    }
    if (newDateParam) {
      if (['current', 'cur'].includes(newDateParam)) {
        newVersion = { ...newVersion, date: dateToFormatedStr(new Date()) };
      } else {
        newVersion = { ...newVersion, date: newDateParam };
      }
    }
    return newVersion;
  });

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

*/

const readChangelogFromFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    log.errAndExit(`changelog file not found at "${filePath}"`);
  }
  const str = readFileSync(filePath, 'utf-8');
  return strToChangelog(str);
};

const writeChangelogToFile = (opt: CliOpt, changelog: Changelog) => {
  if (!existsSync(opt.filePath)) {
    throw new Error(`changelog file not found at "${opt.filePath}"`);
  }
  const str = changelogToStr(changelog, { header: true, sortSections: true, sortItems: true });
  writeFileSync(opt.filePath, str, 'utf-8');
};
