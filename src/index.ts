/* eslint-disable no-console */
import { getChangelog } from 'lib';
import minimist from 'minimist';

import { getArgsBoolParam, Log, LogLevel, UnknownParsedArgs } from './utils';

const log = Log('cli', LogLevel.info);
const cwd = process.cwd();

const help = `
CLI tool for managing CHANGELOG.md file based on "Keep a Changelog" file format

Usage:
  chlog get -v "1.2"

Debug options:
  -v, --version   Show chlog version
  -h, --help      Show this help message and exit
  --debug         Output verbose debugging information
`;

const processArgs = (args: UnknownParsedArgs) => {
  // Check for verbose mode
  const logLevel = args.debug === true ? LogLevel.trace : LogLevel.none;
  log.setLevel(logLevel);
  log.debug('cwd=', cwd);
  if (args._.length) {
    const cmd = args._[0];
    return processCmd(cmd, args);
  } else {
    return processFlags(args);
  }
};

const processCmd = (cmd: string, args: UnknownParsedArgs) => {
  if (cmd === 'get') {
    return processGetCmd(args);
  }
  return log.errAndExit(`Unknown command ${cmd}`);
};

const processGetCmd = (args: UnknownParsedArgs) => {
  return getChangelog(cwd, args);
};

const processFlags = (args: UnknownParsedArgs) => {
  if (getArgsBoolParam(args, ['v', 'version'])) {
    return log.simpleAndExit(VERSION);
  }
  if (getArgsBoolParam(args, ['h', 'help'])) {
    return log.simpleAndExit(help);
  }
  return log.errAndExit('Command required');
};

processArgs(minimist(process.argv.slice(2)));
