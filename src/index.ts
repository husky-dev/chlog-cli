import program from 'commander';
import { addCmd, getCmd, initCmd } from 'lib';
import { resolve } from 'path';
import { log, LogLevel } from 'utils';

program
  .name('chlog')
  .description(
    'CLI tool for managing CHANGELOG.md file based on "Keep a Changelog" format (https://keepachangelog.com/en/1.0.0/).',
  )
  .version(VERSION || '0.0.0', '-v, --version', 'output the current version')
  .option('-p, --path', 'path to the changelog file', 'CHANGELOG.md')
  .option('-d, --debug', 'output extra debugging');

program.on('debug', () => log.setLevel(LogLevel.trace));

const getFilePath = () => {
  const { path } = program.opts();
  return resolve(process.cwd(), typeof path === 'string' ? path : 'CHANGELOG.md');
};

program
  .command('init [fileName]')
  .description('generate a new changelog file', {
    fileName: 'path to the changelog file (default: "./CHANGELOG.md")',
  })
  .action((fileName: string | undefined) => initCmd(getFilePath(), fileName));

program
  .command('get [version]')
  .description('list records for all or specific versions', {
    version: 'exact (1.54.3) or part (1.54) name of the version',
  })
  .action((version: string | undefined) => getCmd(getFilePath(), version));

program
  .command('add <version> <text> [link]')
  .description('add record to the changelog', {
    version: 'to which should be record added',
    text: 'text to be added',
    link: 'a link which text will be wrapped into',
  })
  .option('-f, --fixed', 'add to "Fixed"')
  .option('-a, --added', 'add to "Added"')
  .option('-c, --changed', 'add to "Changed"')
  .option('-d, --deprecated', 'add to "Deprecated"')
  .option('-r, --removed', 'add to "Removed"')
  .option('-s, --security', 'add to "Security"')
  .action((version: string, text: string, link: string | undefined, opts: Record<string, unknown>) =>
    addCmd(getFilePath(), version, text, link, opts),
  );

program
  .command('change <version>')
  .description('change version name or date')
  .option('-n, --name', 'new name')
  .option('-d, --date', 'new date')
  .action(() => {
    // console.log(args[0]);
  });

program
  .command('remove <version>')
  .description('remove version')
  .action(() => {
    // console.log(args[0]);
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
