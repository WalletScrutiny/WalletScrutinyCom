const {series, parallel, src, dest} = require('gulp');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');

function saveGitVariablesTask(done) {
  execSync('printf "last_commit_ref: %s\\n" "$(git rev-parse HEAD)" > ./_data/git.yml');
  execSync('printf "uncommited: %s\\n" "$(git status -s -b | tr \'\\n\' \'*\' | tr \'##\' \' \')" >> ./_data/git.yml');
  done();
}

function jekyllTask(done) {
  exec('bundle exec jekyll build', function (err) {
    done(err);
  }).stdout.pipe(process.stdout);
}

function serveTask(done) {
  exec('bundle exec jekyll serve --profile --trace --host=localhost --config _config.yml,_config.dev.yml', function (err) {
    done(err);
  }).stdout.pipe(process.stdout);
}

function serveIncrementalTask(done) {
  exec('bundle exec jekyll serve --profile --trace --host=localhost --config _config.yml,_config.dev.yml --incremental', function (err) {
    done(err);
  }).stdout.pipe(process.stdout);
}

function sassTask() {
  return src('_site/assets/css/*.css')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('_site/assets/css/'));
}

function minifyIndexHtmlTask() {
  return src('_site/index.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(dest('_site'));
}

function minifyJSTask() {
  return src('_site/**/*.js')
    .pipe(minify({
      noSource: true,
      ext: {
        min: '.js'
      },
      ignoreFiles: ['*.min.js', '*-min.js']
    }))
    .pipe(dest('_site/'));
}

function brotlifyHTMLTask(done) {
  exec('npx brotli-cli compress -q 6 --glob "_site/**/*.html"', function (err) {
    done(err);
  });
}

function brotlifyOthersTask(done) {
  exec('npx brotli-cli compress -q 10 --glob "_site/*.html" --glob "_site/**/*.{js,css,json,ttf,svg,eot,cast}"', function (err) {
    done(err);
  });
}

exports.serve = series(saveGitVariablesTask, serveTask);
exports.serveIncremental = series(saveGitVariablesTask, serveIncrementalTask);
exports.default = series(saveGitVariablesTask, jekyllTask, parallel(sassTask, minifyIndexHtmlTask, minifyJSTask), brotlifyHTMLTask, brotlifyOthersTask);
