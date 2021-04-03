import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { isStr, log } from 'utils';
import { dateToFormatedStr } from 'utils/date';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { Changelog, Section, SectionType, Version } from './types';
import { defChangelogTemplate, getSectionsWithVersion, mergeSections, sectionTypeToName } from './utils';

export const initCmd = (curFilePath: string, fileName: string | undefined) => {
  const filePath = fileName ? resolve(process.cwd(), fileName) : curFilePath;
  log.info(`creating a new changelog at "${filePath}"`);
  writeFileSync(filePath, defChangelogTemplate);
};

export const getCmd = (curFilePath: string, version: string | undefined, opts: { errorOnEmpty?: unknown }) => {
  const changelog = readChangelogFromFile(curFilePath);
  const { errorOnEmpty } = opts;
  if (version) {
    const sections = getSectionsWithVersion(changelog, version);
    const versionRes = sectionsToStr(sections);
    if (errorOnEmpty === true && !versionRes) {
      return log.errAndExit(`changelog for version "${version}" is empty`);
    }
    return log.simpleAndExit(versionRes);
  }
  const fullRes = changelogToStr(changelog, { header: false });
  if (errorOnEmpty === true && !fullRes) {
    return log.errAndExit(`changelog is empty`);
  }
  return log.simpleAndExit(fullRes);
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
    return log.errAndExit('a record type should be provided');
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

export const changeCmd = (curFilePath: string, version: string, opts: { name: unknown; date: unknown }) => {
  const changelog = readChangelogFromFile(curFilePath);
  const { name, date } = opts;

  if (!isStr(name) && !isStr(date)) {
    return log.errAndExit(`Name or date param required`);
  }

  const curVer = changelog.versions.find(itm => itm.name === version);
  if (!curVer) {
    return log.errAndExit(`version "${version}" not found`);
  }

  const versions = changelog.versions.map(itm => {
    if (itm.name !== version) {
      return itm;
    }
    let newVersion: Version = itm;
    if (name && isStr(name)) {
      newVersion = { ...newVersion, name };
    }
    if (date && isStr(date)) {
      if (['current', 'cur'].includes(date)) {
        newVersion = { ...newVersion, date: dateToFormatedStr(new Date()) };
      } else {
        newVersion = { ...newVersion, date };
      }
    }
    return newVersion;
  });

  writeChangelogToFile(curFilePath, { ...changelog, versions });
};

export const removeCmd = (curFilePath: string, version: string) => {
  const changelog = readChangelogFromFile(curFilePath);

  const curVer = changelog.versions.find(itm => itm.name === version);
  if (!curVer) {
    throw new Error(`version ${version} not found`);
  }

  const versions = changelog.versions.filter(itm => itm.name !== version);

  writeChangelogToFile(curFilePath, { ...changelog, versions });
  log.info(`verions "${version}" has been removed`);
};

// File

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
