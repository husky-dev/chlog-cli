import { Changelog, Section, Version } from './types';

export interface GenOpt {
  header?: boolean;
  sortSections?: boolean;
  sortItems?: boolean;
}

const defOpt: GenOpt = {
  sortItems: false,
  sortSections: true,
  header: false,
};

export const changelogToStr = (changelog: Changelog, opt: GenOpt = defOpt): string => {
  const { header, versions } = changelog;
  const lines = versions.map(itm => versionToStr(itm, opt));
  const versionStrs = `${lines.join('\n\n')}`;
  return opt.header && header ? `${header}\n\n${versionStrs}\n` : `${versionStrs}\n`;
};

const versionToStr = (version: Version, opt: GenOpt = defOpt): string => {
  const lines: string[] = [versionToTitle(version)];
  const sectionsStr = sectionsToStr(version.sections, opt);
  if (sectionsStr) {
    lines.push(sectionsStr);
  }
  return lines.join('\n');
};

const versionToTitle = ({ name, date }: Version) => (date ? `## [${name}] - ${date}` : `## [${name}]`);

export const sectionsToStr = (sections: Section[], opt: GenOpt = defOpt): string => {
  const items = opt.sortSections ? sections.sort(sortSectionByNameFn) : sections;
  return items.map(itm => sectionToStr(itm, opt)).join('\n\n');
};

export const sortSectionByNameFn = (a: Section, b: Section): number => {
  if (a.name === b.name) {
    return 0;
  } else {
    return a.name < b.name ? -1 : 1;
  }
};

const sectionToStr = (section: Section, opt: GenOpt = defOpt): string => {
  const title = sectionToTitle(section);
  const items = itemsToStr(section.items, opt);
  return `${title}\n${items}`;
};

const sectionToTitle = ({ name }: Section) => `### ${name}`;

const itemsToStr = (items: string[], opt: GenOpt = defOpt): string => {
  const lines = opt.sortItems ? items.sort().map(itemToStr) : items.map(itemToStr);
  return lines.join('\n');
};

const itemToStr = (itm: string) => `- ${itm}`;
