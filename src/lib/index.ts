import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { log } from 'utils';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { Changelog, Section, SectionType } from './types';
import { defChangelogTemplate, getSectionsWithVersion, mergeSections, sectionTypeToName } from './utils';

export const initCmd = (curFilePath: string, fileName: string | undefined) => {
  const filePath = fileName ? resolve(process.cwd(), fileName) : curFilePath;
  log.info(`creating a new changelog at "${filePath}"`);
  writeFileSync(filePath, defChangelogTemplate);
};

export const getCmd = (curFilePath: string, version: string | undefined) => {
  const changelog = readChangelogFromFile(curFilePath);
  if (version) {
    const sections = getSectionsWithVersion(changelog, version);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog, { header: false }));
};

export const addCmd = (
  curFilePath: string,
  version: string,
  text: string,
  link: string | undefined,
  opts: Record<string, unknown>,
) => {
  const changelog = readChangelogFromFile(curFilePath);

  const curVer = changelog.versions.find(itm => itm.name === version);
  if (!curVer) {
    changelog.versions.unshift({ name: version, sections: [] });
  }

  const sectionType = optsToSectionType(opts);
  if (!sectionType) {
    return log.errAndExit('record type should be provided');
  }

  const finalText = !link ? text : `[${text}](${link})`;
  const newSection: Section = { name: sectionTypeToName(sectionType), items: [finalText] };

  const versions = changelog.versions.map(itm =>
    itm.name !== version ? itm : { ...itm, sections: mergeSections([...itm.sections, newSection]) },
  );

  writeChangelogToFile(curFilePath, { ...changelog, versions });
};

const optsToSectionType = (opts: Record<string, unknown>): SectionType | undefined => {
  const { added, fixed, changed, removed, deprecated, security } = opts;
  if (added === true) return 'added';
  if (fixed === true) return 'fixed';
  if (changed === true) return 'changed';
  if (removed === true) return 'removed';
  if (deprecated === true) return 'deprecated';
  if (security === true) return 'security';
  return undefined;
};

/*

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

const writeChangelogToFile = (filePath: string, changelog: Changelog) => {
  if (!existsSync(filePath)) {
    throw new Error(`changelog file not found at "${filePath}"`);
  }
  const str = changelogToStr(changelog, { header: true, sortSections: true, sortItems: true });
  writeFileSync(filePath, str, 'utf-8');
};
