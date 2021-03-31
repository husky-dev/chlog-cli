import { Changelog, ChangelogSection, ChangelogVersion } from './types';

export const getSectionsWithVersion = (changelog: Changelog, versionName: string): ChangelogSection[] => {
  const filtVersions = changelog.versions.filter(itm => itm.name.indexOf(versionName) === 0);
  if (!filtVersions.length) {
    return [];
  }
  return mergeVersionsSections(filtVersions);
};

export const mergeVersionsSections = (versions: ChangelogVersion[]): ChangelogSection[] => {
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

export const addItemToSections = (sections: ChangelogSection[], name: string, item: string): ChangelogSection[] => {
  const curSection = sections.find(itm => itm.name === name);
  return curSection
    ? sections.map(itm => (itm.name !== name ? itm : { ...itm, items: [...itm.items, item] }))
    : [...sections, { name, items: [item] }];
};
