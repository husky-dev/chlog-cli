import { getArgsBoolParam, getArgsStrParam, UnknownParsedArgs } from 'utils';
import { Changelog, Section, SectionType, Version } from './types';

export const defUnreleasedVersionName = 'Unreleased';

/**
 * Sections
 */

const sectionTypeArr: SectionType[] = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security'];

/**
 * Converts section type to it's name
 * @param val - section type
 * @returns section name
 */
const sectionTypeToName = (val: SectionType): string => {
  switch (val) {
    case 'added':
      return 'Added';
    case 'changed':
      return 'Changed';
    case 'deprecated':
      return 'Deprecated';
    case 'removed':
      return 'Removed';
    case 'fixed':
      return 'Fixed';
    case 'security':
      return 'Security';
  }
};

/**
 * Converts section type to the names of incoming args params
 * @param val - section type
 * @returns incoming args array
 */
const sectionTypeToArgParams = (val: SectionType): string[] => {
  switch (val) {
    case 'added':
      return ['added', 'a'];
    case 'changed':
      return ['changed', 'c'];
    case 'deprecated':
      return ['deprecated', 'd'];
    case 'removed':
      return ['removed', 'r'];
    case 'fixed':
      return ['fixed', 'f'];
    case 'security':
      return ['security', 's'];
  }
};

/**
 * Returns merged scections of the specific version
 * @param changelog - changelog data
 * @param versionName - name of the version or it's part (e.g. `1.52.1`, `1.52`)
 * @returns merged sections
 */
export const getSectionsWithVersion = (changelog: Changelog, versionName: string): Section[] => {
  const filtVersions = changelog.versions.filter(itm => itm.name.indexOf(versionName) === 0);
  if (!filtVersions.length) {
    return [];
  }
  return mergeVersionsSections(filtVersions);
};

export const mergeVersionsSections = (versions: Version[]): Section[] => {
  const sections: Section[] = [];
  for (const version of versions) {
    sections.push(...version.sections);
  }
  return mergeSections(sections);
};

export const mergeSections = (sections: Section[]): Section[] => {
  const obj: Record<string, string[]> = {};
  for (const section of sections) {
    if (typeof obj[section.name] !== 'undefined') {
      obj[section.name].push(...section.items);
    } else {
      obj[section.name] = section.items;
    }
  }
  const keys = Object.keys(obj).sort();
  return keys.map(key => ({ name: key, items: obj[key].sort() }));
};

/**
 * Converts invoming command line arguments to a new section
 * `-f`, `--fixed`
 * `-a`, `--added`
 * `-c`, `--changed`
 * `-d`, `--deprecated`
 * `-r`, `--removed`
 * `-s`, `--security`
 * @param args - incoming arguments
 * @returns new section
 */
export const argsToNewSectionItem = (args: UnknownParsedArgs): Section => {
  for (const sectionType of sectionTypeArr) {
    const strParam = getArgsStrParam(args, sectionTypeToArgParams(sectionType));
    if (strParam) {
      return { name: sectionTypeToName(sectionType), items: [strParam] };
    }
    const boolParam = getArgsBoolParam(args, sectionTypeToArgParams(sectionType));
    const strTextParam = args._[1];
    if (boolParam && !strTextParam) {
      throw new Error('New changelog item name shold be provided');
    }
    if (boolParam && strTextParam) {
      return { name: sectionTypeToName(sectionType), items: [strTextParam] };
    }
  }
  throw new Error('Section type not provided');
};

export const defChangelogTemplate = `# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Fixed
### Deprecated
### Security
`;
