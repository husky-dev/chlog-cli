import { Changelog, ChangelogGenOpt, ChangelogSection, ChangelogVersion } from './types';

const defOpt: ChangelogGenOpt = {
  sortRecords: true,
  sortSections: true,
};

export const changelogToStr = (changelog: Changelog, opt: ChangelogGenOpt = defOpt): string => {
  const { versions } = changelog;
  const lines = versions.map(itm => versionToStr(itm, opt));
  return `${lines.join('\n\n')}`;
};

const versionToStr = (version: ChangelogVersion, opt: ChangelogGenOpt = defOpt): string => {
  const lines: string[] = [versionToTitle(version)];
  lines.push(sectionsToStr(version.sections, opt));
  return lines.join('\n');
};

const versionToTitle = ({ name, date }: ChangelogVersion) => (date ? `## [${name}] - ${date}` : `## [${name}]`);

export const sectionsToStr = (sections: ChangelogSection[], opt: ChangelogGenOpt = defOpt): string => {
  const items = opt.sortSections ? sections.sort(sortSectionByNameFn) : sections;
  return items.map(itm => sectionToStr(itm, opt)).join('\n\n');
};

const sortSectionByNameFn = (a: ChangelogSection, b: ChangelogSection): number => {
  if (a === b) {
    return 0;
  } else {
    return a < b ? 0 : 1;
  }
};

const sectionToStr = (section: ChangelogSection, opt: ChangelogGenOpt = defOpt): string => {
  const title = sectionToTitle(section);
  const items = itemsToStr(section.items, opt);
  return `${title}\n${items}`;
};

const sectionToTitle = ({ name }: ChangelogSection) => `### ${name}`;

const itemsToStr = (items: string[], opt: ChangelogGenOpt = defOpt): string => {
  const lines = opt.sortRecords ? items.sort().map(itemToStr) : items.map(itemToStr);
  return lines.join('\n');
};

const itemToStr = (itm: string) => `- ${itm}`;
