/* eslint-disable no-console */
import { processCmd } from 'lib';
import minimist from 'minimist';

import { CliOpt, getArgsBoolParam, getArgsStrParam, Log, LogLevel, UnknownParsedArgs } from './utils';

const log = Log('cli', LogLevel.info);

const help = `
usage: chlog [<flags>] <command> [<args> ...]

CLI tool for managing CHANGELOG.md file based on "Keep a Changelog" file format

Global flags:
  -h, --help     Print help
  -p, --path     Path to the CHANGELOG.md file
  -v, --version  Print version
  --debug        Output verbose debugging information

Commands:
  get:      Get changelog
  add:      Add record to the changelog
  change:   Change version name or date
  remove:   Remove version
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
