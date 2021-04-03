/* eslint-disable no-console */
import { Command } from 'commander';
import { getCmd, initCmd } from 'lib';

const program = new Command();

program
  .name('chlog')
  .description(
    'CLI tool for managing CHANGELOG.md file based on "Keep a Changelog" format (https://keepachangelog.com/en/1.0.0/).',
  )
  .version(VERSION || '0.0.0', '-v, --version', 'output the current version')
  .option('-f, --file', 'path to the changelog file', 'CHANGELOG.md')
  .option('-d, --debug', 'output extra debugging');

program
  .command('init [fileName]')
  .description('generate a new changelog file', {
    fileName: 'path to the changelog file (default: "./CHANGELOG.md")',
  })
  .action((fileName: string | undefined) => initCmd(fileName));

program
  .command('get [version]')
  .description('list records for all or specific versions', {
    version: 'exact (1.54.3) or part (1.54) name of the version',
  })
  .action((version: string | undefined) => getCmd(version));

program
  .command('add <text> [link]')
  .description('add record to the changelog', {
    text: 'text to be added',
    link: 'a link which text will be wrapped into',
  })
  .option('-f, --fixed', 'add to "Fixed"')
  .option('-a, --added', 'add to "Added"')
  .option('-c, --changed', 'add to "Changed"')
  .option('-d, --deprecated', 'add to "Deprecated"')
  .option('-r, --removed', 'add to "Removed"')
  .option('-s, --security', 'add to "Security"')
  .action((...args) => {
    console.log(args[0], args[1], args[2]);
  });

program
  .command('change <version>')
  .description('change version name or date')
  .option('-n, --name', 'new name')
  .option('-d, --date', 'new date')
  .action((...args) => {
    console.log(args[0]);
  });

program
  .command('remove <version>')
  .description('remove version')
  .action((...args) => {
    console.log(args[0]);
  });

program.parse(process.argv);

// const opts = program.opts();

// const logLevel = opts.debug === true ? LogLevel.trace : LogLevel.none;
// log.setLevel(logLevel);

// const processArgs = (args: UnknownParsedArgs) => {
//   const logLevel = getArgsBoolParam(args, ['debug']) ? LogLevel.trace : LogLevel.none;
//   log.setLevel(logLevel);

//   const argsFilePath = getArgsStrParam(args, ['p', 'path']);
//   const opt: CliOpt = {
//     filePath: argsFilePath ? argsFilePath : `${process.cwd()}/CHANGELOG.md`,
//   };
//   log.debug('opt=', JSON.stringify(opt));

//   try {
//     if (args._.length) {
//       const cmd = args._[0];
//       return processCmd(cmd, args, opt);
//     } else {
//       return processFlags(args);
//     }
//   } catch (err: unknown) {
//     log.errAndExit(errToStr(err));
//   }
// };

// const processFlags = (args: UnknownParsedArgs) => {
//   if (getArgsBoolParam(args, ['v', 'version'])) {
//     return log.simpleAndExit(VERSION);
//   }
//   if (getArgsBoolParam(args, ['h', 'help'])) {
//     return log.simpleAndExit(help);
//   }
//   throw new Error('Command required');
// };

// processArgs(minimist(process.argv.slice(2)));
