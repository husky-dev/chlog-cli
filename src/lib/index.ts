import { existsSync, readFileSync, writeFileSync } from 'fs';
import { CliOpts, getArgsBoolParam, getArgsStrParam, Log, UnknownParsedArgs } from 'utils';

import { changelogToStr, sectionsToStr } from './generator';
import { strToChangelog } from './parser';
import { Changelog } from './types';
import { addItemToSections, getSectionsWithVersion } from './utils';

const log = Log('changelog');

const defVersionParam = 'Unreleased';
const addedSectionName = 'Added';
const changedSectionName = 'Changed';
const deprecatedSectionName = 'Deprecated';
const removedSectionName = 'Removed';
const fixedSectionName = 'Fixed';
const securitySectionName = 'Security';

export const processCmd = (cmd: string, args: UnknownParsedArgs, opt: CliOpts) => {
  if (cmd === 'get') {
    return processGetCmd(args, opt);
  }
  if (cmd === 'add') {
    return processAddCmd(args, opt);
  }
  return log.errAndExit(`Unknown command ${cmd}`);
};

const processGetCmd = (args: UnknownParsedArgs, opt: CliOpts) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsStrParam(args, ['version', 'v']);
  if (verParam) {
    const sections = getSectionsWithVersion(changelog, `${verParam}`);
    return log.simpleAndExit(sectionsToStr(sections));
  }
  return log.simpleAndExit(changelogToStr(changelog, { header: false }));
};

const processAddCmd = (args: UnknownParsedArgs, opt: CliOpts) => {
  const changelog = readChangelogFromFile(opt);
  const verParam = getArgsStrParam(args, ['version', 'v']) || defVersionParam;
  const addedBoolParam = getArgsBoolParam(args, ['added', 'a']);
  const addedStrParam = getArgsStrParam(args, ['added', 'a']);
  const changedBoolParam = getArgsBoolParam(args, ['changed', 'c']);
  const changedStrParam = getArgsStrParam(args, ['changed', 'c']);
  const deprecatedBoolParam = getArgsBoolParam(args, ['deprecated', 'd']);
  const deprecatedStrParam = getArgsStrParam(args, ['deprecated', 'd']);
  const removedBoolParam = getArgsBoolParam(args, ['removed', 'r']);
  const removedStrParam = getArgsStrParam(args, ['removed', 'r']);
  const fixedBoolParam = getArgsBoolParam(args, ['fixed', 'f']);
  const fixedStrParam = getArgsStrParam(args, ['fixed', 'f']);
  const securityBoolParam = getArgsBoolParam(args, ['security', 's']);
  const securityStrParam = getArgsStrParam(args, ['security', 's']);

  const curVer = changelog.versions.find(itm => itm.name === verParam);
  if (!curVer) {
    changelog.versions.unshift({ name: verParam, sections: [] });
  }

  const versions = changelog.versions.map(version => {
    if (version.name !== verParam) {
      return version;
    }
    if (addedStrParam) {
      return { ...version, sections: addItemToSections(version.sections, addedSectionName, addedStrParam) };
    }
    if (changedStrParam) {
      return { ...version, sections: addItemToSections(version.sections, changedSectionName, changedStrParam) };
    }
    if (deprecatedStrParam) {
      return { ...version, sections: addItemToSections(version.sections, deprecatedSectionName, deprecatedStrParam) };
    }
    if (removedStrParam) {
      return { ...version, sections: addItemToSections(version.sections, removedSectionName, removedStrParam) };
    }
    if (fixedStrParam) {
      return { ...version, sections: addItemToSections(version.sections, fixedSectionName, fixedStrParam) };
    }
    if (securityStrParam) {
      return { ...version, sections: addItemToSections(version.sections, securityStrParam, securityStrParam) };
    }
    if (args._.length < 2) {
      throw new Error('New changelog item name shold be provided');
    }
    const strParam = args._[1];
    if (addedBoolParam) {
      return { ...version, sections: addItemToSections(version.sections, addedSectionName, strParam) };
    }
    if (changedBoolParam) {
      return { ...version, sections: addItemToSections(version.sections, changedSectionName, strParam) };
    }
    if (deprecatedBoolParam) {
      return { ...version, sections: addItemToSections(version.sections, deprecatedSectionName, strParam) };
    }
    if (removedBoolParam) {
      return { ...version, sections: addItemToSections(version.sections, removedSectionName, strParam) };
    }
    if (fixedBoolParam) {
      return { ...version, sections: addItemToSections(version.sections, fixedSectionName, strParam) };
    }
    if (securityBoolParam) {
      return { ...version, sections: addItemToSections(version.sections, securitySectionName, strParam) };
    }
    return version;
  });

  writeChangelogToFile(opt, { ...changelog, versions });
};

// File

const readChangelogFromFile = (opt: CliOpts) => {
  if (!existsSync(opt.filePath)) {
    throw new Error(`changelog file not found at path "${opt.filePath}"`);
  }
  const str = readFileSync(opt.filePath, 'utf-8');
  return strToChangelog(str);
};

const writeChangelogToFile = (opt: CliOpts, changelog: Changelog) => {
  if (!existsSync(opt.filePath)) {
    throw new Error(`changelog file not found at path "${opt.filePath}"`);
  }
  const str = changelogToStr(changelog, { header: true, sortSections: true, sortItems: true });
  writeFileSync(opt.filePath, str, 'utf-8');
};
