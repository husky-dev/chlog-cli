import { Changelog, Section, Version, VersionData } from './types';

export const strToChangelog = (val: string): Changelog => {
  const lines = val.split('\n');
  const versions: Version[] = [];

  const headerLines: string[] = [];
  let curBody: string[] = [];
  let curVersion: VersionData | undefined = undefined;

  for (const line of lines) {
    const verInfo = strToVersion(line);
    if (verInfo) {
      if (curVersion) {
        versions.push({ ...curVersion, sections: strLinesToSections(curBody) });
      }
      curVersion = verInfo;
      curBody = [];
    } else {
      curBody.push(line);
    }
    if (!verInfo && !curVersion) {
      headerLines.push(line);
    }
  }
  if (curVersion) {
    versions.push({ ...curVersion, sections: strLinesToSections(curBody) });
  }
  const header = clearHeaderStr(headerLines.join('\n'));
  return header ? { header, versions } : { versions };
};

const clearHeaderStr = (rawStr: string): string => {
  let str: string = rawStr;
  str = str.trim();
  return str;
};

export const strToVersion = (val: string): VersionData | undefined => {
  const withDateMatch = /^##\s*\[([\w.]+)\]\s*-\s*(.+)$/.exec(val);
  if (withDateMatch) {
    return { name: withDateMatch[1], date: withDateMatch[2].trim() };
  }
  const withoutDateMatch = /^##\s*\[([\w.]+)\]\s*$/.exec(val);
  if (withoutDateMatch) {
    return { name: withoutDateMatch[1] };
  }
  return undefined;
};

const strLinesToSections = (val: string[]): Section[] => {
  const sections: Section[] = [];
  let curName: string | undefined = undefined;
  let curItems: string[] = [];
  for (const rawLine of val) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
    const name = strToSectionName(line);
    if (name) {
      if (curName) {
        sections.push({ name: curName, items: curItems });
      }
      curName = name;
      curItems = [];
    } else {
      curItems.push(modSectionItemStr(line));
    }
  }
  if (curName) {
    sections.push({ name: curName, items: curItems });
  }
  return sections;
};

export const strToSectionName = (val: string): string | undefined => {
  const match = /^###\s*(.+)$/.exec(val);
  return match ? match[1].trim() : undefined;
};

const modSectionItemStr = (val: string): string => {
  let modVal = val.replace(/^\s*-\s*/g, '');
  modVal = modVal.trim();
  return modVal;
};
