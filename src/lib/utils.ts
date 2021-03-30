import { Changelog, ChangelogSection } from './types';

export const getChangelogSectionsWithVersonNamePattern = (changelog: Changelog, versionName: string): ChangelogSection[] => {
  const filtVersions = changelog.versions.filter(itm => itm.name.indexOf(versionName) >= 0);
  if (!filtVersions.length) {
    return [];
  }
  const obj: Record<string, string[]> = {};
  for (const version of filtVersions) {
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
