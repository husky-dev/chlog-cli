/* eslint-disable no-console */
import { processCmd } from 'lib';
import minimist from 'minimist';

import { CliOpt, getArgsBoolParam, getArgsStrParam, Log, LogLevel, UnknownParsedArgs } from './utils';

const log = Log('cli', LogLevel.info);

const help = `
CLI tool for managing CHANGELOG.md file based on "Keep a Changelog" file format

Usage:
  chlog get -v "1.2"

-p, --path   Changelog file path

Debug options:
  -v, --version   Show chlog version
  -h, --help      Show this help message and exit
  --debug         Output verbose debugging information
`;

const processArgs = (args: UnknownParsedArgs) => {
  const logLevel = getArgsBoolParam(args, ['debug']) ? LogLevel.trace : LogLevel.none;
  log.setLevel(logLevel);

  const argsFilePath = getArgsStrParam(args, ['p', 'path']);
  const opt: CliOpt = {
    filePath: argsFilePath ? argsFilePath : `${process.cwd()}/CHANGELOG.md`,
  };
  log.debug('opt=', JSON.stringify(opt));

  try {
    if (args._.length) {
      const cmd = args._[0];
      return processCmd(cmd, args, opt);
    } else {
      return processFlags(args);
    }
  } catch (err: unknown) {
    log.err(err);
  }
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
