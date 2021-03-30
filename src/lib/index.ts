import { CLIOpts } from "../utils/cli";
import { Log } from "../utils/log";
import { existsSync, readFileSync } from "fs";

const log = Log("changelog");

export const processChangelogCmd = (
  command: string[],
  args: Record<string, any>,
  { cwd, logLevel }: CLIOpts
) => {
  try {
    log.setLevel(logLevel);
    if (command.length === 0) {
      return getChangelog(cwd, args);
    }
    if (command[0] === "get") {
      return getChangelog(cwd, args);
    }
    throw new Error(`unknown changelog command "${command[0]}"`);
  } catch (err) {
    return log.errAndExit(err.message);
  }
};

const getChangelog = (cwd: string, args: Record<string, any>) => {
  const str = getChangelogStr(cwd);
  const changelog = strToChangelog(str);
  const verParam = args.v || args.version;
  if (typeof verParam === "string" || typeof verParam === "number") {
    const sections = getChangelogSectionsWithVersonNamePattern(
      changelog,
      `${verParam}`
    );
    return log.simple(sectionsToStr(sections));
  }
  return log.simple(changelogToStr(changelog));
};

// File

const getChangelogStr = (cwd: string) => {
  const filePath = `${cwd}/CHANGELOG.md`;
  if (!existsSync(filePath)) {
    throw new Error(`changelog file not found at path "${filePath}"`);
  }
  return readFileSync(filePath, "utf-8");
};

// Parsing

interface Changelog {
  versions: ChangelogVersion[];
}

interface ChangelogVersion {
  name: string;
  date: string;
  sections: ChangelogSection[];
}

interface ChangelogSection {
  name: string;
  items: string[];
}

const strToChangelog = (val: string): Changelog => {
  const lines = val.split("\n");
  const versions: ChangelogVersion[] = [];

  let curBody: string[] = [];
  let curVersion: ChangelogVersion | undefined = undefined;

  for (const line of lines) {
    const verData = strToVersion(line);
    if (verData) {
      if (curVersion) {
        versions.push({ ...curVersion, sections: strsToSections(curBody) });
      }
      curVersion = verData;
      curBody = [];
    } else {
      curBody.push(line);
    }
  }
  if (curVersion) {
    versions.push({ ...curVersion, sections: strsToSections(curBody) });
  }

  return { versions };
};

const strToVersion = (val: string): ChangelogVersion | undefined => {
  const match = /^##\s*\[([\d.]+)\]\s*-\s*(.+)$/.exec(val);
  return match
    ? { name: match[1], date: match[2].trim(), sections: [] }
    : undefined;
};

const strsToSections = (val: string[]): ChangelogSection[] => {
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

const strToSectionName = (val: string): string | undefined => {
  const match = /^###\s*(.+)$/.exec(val);
  return match ? match[1].trim() : undefined;
};

const modSectionItemStr = (val: string): string => {
  let modVal = val.replace(/^\s*-\s*/g, "");
  modVal = modVal.trim();
  return modVal;
};

// Building

const changelogToStr = ({ versions }: Changelog): string => {
  const lines = versions.map((itm) => versionToStr(itm));
  return `${lines.join("\n\n")}`;
};

const versionToStr = (version: ChangelogVersion): string => {
  const lines: string[] = [`## [${version.name}] - ${version.date}`];
  lines.push(sectionsToStr(version.sections));
  return lines.join("\n");
};

const sectionsToStr = (sections: ChangelogSection[]): string =>
  sections.sort(sortSectionByNameFn).map(sectionToStr).join("\n\n");

const sortSectionByNameFn = (
  a: ChangelogSection,
  b: ChangelogSection
): number => {
  if (a === b) {
    return 0;
  } else {
    return a < b ? 0 : 1;
  }
};

const sectionToStr = (section: ChangelogSection): string => {
  const lines = [`### ${section.name}`];
  const items = section.items.sort().map((itm) => `- ${itm}`);
  lines.push(...items);
  return lines.join("\n");
};

// Manipulations

const getChangelogSectionsWithVersonNamePattern = (
  changelog: Changelog,
  versionName: string
): ChangelogSection[] => {
  const filtVersions = changelog.versions.filter(
    (itm) => itm.name.indexOf(versionName) >= 0
  );
  if (!filtVersions.length) {
    return [];
  }
  const obj: Record<string, string[]> = {};
  for (const version of filtVersions) {
    for (const section of version.sections) {
      if (obj[section.name]) {
        obj[section.name].push(...section.items);
      } else {
        obj[section.name] = section.items;
      }
    }
  }
  const keys = Object.keys(obj).sort();
  return keys.map((key) => ({ name: key, items: obj[key].sort() }));
};
