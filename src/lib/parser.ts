import { Changelog, ChangelogSection, ChangelogVersion } from './types';

export const strToChangelog = (val: string): Changelog => {
  const lines = val.split('\n');
  const versions: ChangelogVersion[] = [];

  let curBody: string[] = [];
  let curVersion: ChangelogVersion | undefined = undefined;

  for (const line of lines) {
    const verData = strToVersion(line);
    if (verData) {
      if (curVersion) {
        versions.push({ ...curVersion, sections: strLinesToSections(curBody) });
      }
      curVersion = verData;
      curBody = [];
    } else {
      curBody.push(line);
    }
  }
  if (curVersion) {
    versions.push({ ...curVersion, sections: strLinesToSections(curBody) });
  }

  return { versions };
};

const strToVersion = (val: string): ChangelogVersion | undefined => {
  const match = /^##\s*\[([\d.]+)\]\s*-\s*(.+)$/.exec(val);
  return match ? { name: match[1], date: match[2].trim(), sections: [] } : undefined;
};

const strLinesToSections = (val: string[]): ChangelogSection[] => {
  const sections: ChangelogSection[] = [];
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
