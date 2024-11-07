const { series, src, dest } = require('gulp');
const exec = require('child_process').exec;
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');

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
  src('_site/assets/css/*.css')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('_site/assets/css/'));
  done();
}

function minifyIndexHtmlTask(done) {
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

function minifyJSTask(done) {
  src('_site/**/*.js')
    .pipe(minify({
      noSource: true,
      ext: {
        min: '.js'
      },
      ignoreFiles: ['*.min.js', '*-min.js']
    }))
    .pipe(dest('_site/'));
  done();
}

exports.jekyll = jekyllTask;
exports.serve = serveTask;
exports.serveIncremental = serveIncrementalTask;
exports.default = series(jekyllTask, sassTask, minifyIndexHtmlTask, minifyJSTask);
