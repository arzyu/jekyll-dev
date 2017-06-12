#!/usr/bin/env node

import * as path from 'path';

import * as program from 'commander';

import * as packageInfo from '../package.json';
import run from './tasks';

function resolvePath(jekyllSite: string): string {
  return path.resolve(process.cwd(), jekyllSite);
}

program
  .version((packageInfo as any).version)
  .option('--jekyll-site <path>', 'Jekyll site path', resolvePath, process.cwd())
  .option('--port <port>', 'Livereload server port', '4000')
  .parse(process.argv);

run({
  jekyllPath: program.jekyllSite,
  port: program.port
});
