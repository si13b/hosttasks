#!/usr/bin/env node

const main = require('./hosttasks');
const program = require('commander');
const packageJson = require('./package.json');

program
  .version(packageJson.version)
	.description('Block sites in host file until you complete certain tasks')
	.option('-m, --mode [mode]', 'Reset (reset) or complete tasks (done). [done]', 'done')
  .option('-c, --config [path]', 'Specify the path to the config file. [config.json]', 'config.json')
  .parse(process.argv);

main(program.mode, program.config);
