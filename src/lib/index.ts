import { existsSync, readFileSync, writeFileSync } from 'fs';
import {
  CliOpt,
  getArgsStrParam,
  getArgsVersionParam,
  getArgsVersionParamOrErr,
  isArgsHelpRequest,
  log,
  UnknownParsedArgs,
} from 'utils';
import { dateToFormatedStr } from 'utils/date';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { Changelog, Version } from './types';
import { argsToNewSectionItem, defUnreleasedVersionName, getSectionsWithVersion, mergeSections } from './utils';

export const processCmd = (cmd: string, args: UnknownParsedArgs, opt: CliOpt) => {
  if (cmd === 'init') {
    return processInitCmd(args, opt);
  }
  if (cmd === 'get') {
    return processGetCmd(args, opt);
  }
  if (cmd === 'add') {
    return processAddCmd(args, opt);
  }
  if (cmd === 'change') {
    return processChangeCmd(args, opt);
  }
  if (cmd === 'remove') {
    return processRemoveCmd(args, opt);
  }
  throw new Error(`Unknown command "${cmd}"`);
};

const initCmdHelp = `Usage: chlog init [options]

Generate initial CHANGELOG.md file

Options:
  -f, --file  File name (default: "CHANGELOG.md")
`;

const processInitCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  if (isArgsHelpRequest(args)) {
    return log.simpleAndExit(initCmdHelp);
  }
  return;
};

const processGetCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsVersionParam(args);
  if (verParam) {
    const sections = getSectionsWithVersion(changelog, `${verParam}`);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog, { header: false }));
};

const processAddCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsVersionParam(args) || defUnreleasedVersionName;

  const curVer = changelog.versions.find(itm => itm.name === verParam);
  if (!curVer) {
    changelog.versions.unshift({ name: verParam, sections: [] });
  }

  const newSection = argsToNewSectionItem(args);

  const versions = changelog.versions.map(version =>
    version.name !== verParam ? version : { ...version, sections: mergeSections([...version.sections, newSection]) },
  );

  writeChangelogToFile(opt, { ...changelog, versions });
};

const processChangeCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsVersionParamOrErr(args);
  const newNameParam = getArgsStrParam(args, ['name', 'n']);
  const newDateParam = getArgsStrParam(args, ['date', 'd']);

  if (!newNameParam && !newDateParam) {
    throw new Error('Name or date param required');
  }

  const curVer = changelog.versions.find(itm => itm.name === verParam);
  if (!curVer) {
    throw new Error(`Version "${verParam}" not found`);
  }

  const versions = changelog.versions.map(version => {
    if (version.name !== verParam) {
      return version;
    }
    let newVersion: Version = version;
    if (newNameParam) {
      newVersion = { ...newVersion, name: newNameParam };
    }
    if (newDateParam) {
      if (['current', 'cur'].includes(newDateParam)) {
        newVersion = { ...newVersion, date: dateToFormatedStr(new Date()) };
      } else {
        newVersion = { ...newVersion, date: newDateParam };
      }
    }
    return newVersion;
  });

  writeChangelogToFile(opt, { ...changelog, versions });
};

const processRemoveCmd = (args: UnknownParsedArgs, opt: CliOpt) => {
  const changelog = readChangelogFromFile(opt);

  const verParam = getArgsVersionParamOrErr(args);

  const curVer = changelog.versions.find(itm => itm.name === verParam);
  if (!curVer) {
    throw new Error(`Version ${verParam} not found`);
  }

  const versions = changelog.versions.filter(itm => itm.name !== verParam);

  writeChangelogToFile(opt, { ...changelog, versions });
};

// File

const readChangelogFromFile = (opt: CliOpt) => {
  if (!existsSync(opt.filePath)) {
    throw new Error(`changelog file not found at path "${opt.filePath}"`);
  }
  const str = readFileSync(opt.filePath, 'utf-8');
  return strToChangelog(str);
};

const writeChangelogToFile = (opt: CliOpt, changelog: Changelog) => {
  if (!existsSync(opt.filePath)) {
    throw new Error(`changelog file not found at path "${opt.filePath}"`);
  }
  const str = changelogToStr(changelog, { header: true, sortSections: true, sortItems: true });
  writeFileSync(opt.filePath, str, 'utf-8');
};
