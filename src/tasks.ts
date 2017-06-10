import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import * as chalk from 'chalk';
import * as gulp from 'gulp';
import * as server from 'gulp-server-livereload';
import * as yaml from 'js-yaml';

export default function run(options: {jekyllPath: string, port: string}) {
  const { jekyllPath, port } = options;

  function buildJekyll(): void {
    const cmd = 'bundle exec jekyll build --incremental && echo';
    try {
      child_process.execSync(cmd, { cwd: jekyllPath, stdio: 'inherit' });
    } catch (error) {} // tslint:disable-line:no-empty
  }

  function getJekyllTheme(): string {
    try {
      const configYaml = fs.readFileSync(`${jekyllPath}/_config.yml`, 'utf8');
      const jekyllConfig: object = yaml.safeLoad(configYaml);
      const themeName = (jekyllConfig as any).theme;
      const themePath = child_process.execSync(
        `bundle show ${themeName}`,
        { cwd: jekyllPath, encoding: 'utf8' }
      );
      return themePath.trim();
    } catch (error) {
      // catch error from `bundle show ...`
      if (error.stdout) {
        console.log(chalk.red(error.stdout));
      }
      throw(error);
    }
  }

  const themePath = getJekyllTheme();

  gulp.task('watch', ['build'], () => {
    const globs = [
      `${themePath}/**/*`,
      `${jekyllPath}/**/*`,
      `!${jekyllPath}/_site/**/*`
    ];
    gulp.watch(globs, (event) => {
      const parentPath = path.resolve(
        event.path.startsWith(themePath) ? themePath : jekyllPath,
        '..'
      );
      const relativePath = path.relative(parentPath, event.path);
      console.log(chalk.blue(`\n[jekyll-dev] ${relativePath}, ${event.type}\n`));
      buildJekyll();
    });
  });

  gulp.task('server', ['build'], () => {
    gulp.src(`${jekyllPath}/_site`)
      .pipe(server({ livereload: true, port }));
  });

  gulp.task('build', (done) => {
    buildJekyll();
    done();
  });

  gulp.task('default', ['watch', 'server']);

  console.log(chalk.blue(`\n[jekyll-dev]:\n    site => ${jekyllPath}\n   theme => ${themePath}\n`));

  gulp.start();
}
