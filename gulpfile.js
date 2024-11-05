const { series, src, dest } = require('gulp');
const exec = require('child_process').exec;
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');
const del = require('del');
const rename = require('gulp-rename');

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

function sassTask(done) {
  src('./_site/assets/css/*.css')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('./_site/assets/css/'));
  done();
}

function minifyTask(done) {
  src('_site/index.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(dest('_site'));
  done();
}

function minjsTask(done) {
  src('_site/**/*.js')
    .pipe(minify({
      ext: {
        min: '.jsm'
      },
      ignoreFiles: ['*.min.js', '*-min.js']
    }))
    .pipe(dest('_site/'));
  done();
}

function cleanjsTask(done) {
  del(['_site/**/*.js', '!**/*.min.js', '!**/*-min.js']);
  done();
}

function renameTask() {
  return src('./_site/**/*.jsm')
    .pipe(rename({ extname: '.js' }))
    .pipe(dest('./_site/'));
}

function cleanjsmTask(done) {
  del(['_site/**/*.jsm']);
  done();
}

exports.jekyll = jekyllTask;
exports.serve = serveTask;
exports.serveIncremental = serveIncrementalTask;
exports.default = series(jekyllTask, sassTask, minifyTask, minifyTask, minjsTask, cleanjsTask, renameTask, cleanjsmTask);
