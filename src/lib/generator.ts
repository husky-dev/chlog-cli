import { Changelog, ChangelogSection, ChangelogVersion } from './types';

export const changelogToStr = ({ versions }: Changelog): string => {
  const lines = versions.map(itm => versionToStr(itm));
  return `${lines.join('\n\n')}`;
};

const versionToStr = (version: ChangelogVersion): string => {
  const lines: string[] = [`## [${version.name}] - ${version.date}`];
  lines.push(sectionsToStr(version.sections));
  return lines.join('\n');
};

export const sectionsToStr = (sections: ChangelogSection[]): string =>
  sections.sort(sortSectionByNameFn).map(sectionToStr).join('\n\n');

const sortSectionByNameFn = (a: ChangelogSection, b: ChangelogSection): number => {
  if (a === b) {
    return 0;
  } else {
    return a < b ? 0 : 1;
  }
};

const sectionToStr = (section: ChangelogSection): string => {
  const lines = [`### ${section.name}`];
  const items = section.items.sort().map(itm => `- ${itm}`);
  lines.push(...items);
  return lines.join('\n');
};
