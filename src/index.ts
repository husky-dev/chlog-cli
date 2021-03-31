#! /usr/bin/env node
/* eslint-disable no-console */
import { getChangelog } from 'lib';
import minimist from 'minimist';

import { CLIOpts, Log, LogLevel, UnknownParsedArgs } from './utils';

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
  // Current path
  log.debug('cwd=', cwd);
  // Help
  if (args.h === true || args.help === true) {
    log.simpleAndExit(help);
  }
  // Parsing commands
  if (args._.length) {
    const cmd = args._[0];
    if (cmd === 'get') {
      return processGetCmd(args, { cwd, logLevel });
    }
    return log.errAndExit(`Unknown command "${cmd}"`);
  } else {
    return log.errAndExit('Command required');
  }
};

const processGetCmd = (args: UnknownParsedArgs, opts: CLIOpts) => {
  return getChangelog(opts.cwd, args);
};

processArgs(minimist(process.argv.slice(2)));
