import { getArgsBoolParam, getArgsStrParam, UnknownParsedArgs } from 'utils';
import { Changelog, Section, SectionType, Version } from './types';

/**
 * Sections
 */

const sectionTypeArr: SectionType[] = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security'];

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

export const getSectionsWithVersion = (changelog: Changelog, versionName: string): Section[] => {
  const filtVersions = changelog.versions.filter(itm => itm.name.indexOf(versionName) === 0);
  if (!filtVersions.length) {
    return [];
  }
  return mergeVersionsSections(filtVersions);
};

export const mergeVersionsSections = (versions: Version[]): Section[] => {
  const obj: Record<string, string[]> = {};
  for (const version of versions) {
    for (const section of version.sections) {
      if (typeof obj[section.name] !== 'undefined') {
        obj[section.name].push(...section.items);
      } else {
        obj[section.name] = section.items;
      }
    }
  }
  const keys = Object.keys(obj).sort();
  return keys.map(key => ({ name: key, items: obj[key].sort() }));
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
