var gulp = require('gulp')
var shell = require('gulp-shell')
var sass = require('gulp-sass')(require('node-sass'))
var minify = require('gulp-minify')
var rename = require('gulp-rename')
sass.compiler = require('node-sass')
var del = require('del')
const htmlmin = require('gulp-htmlmin')

gulp.task('minify', () => {
  return gulp
    .src('_site/index.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest('_site'))
})

gulp.task('minjs', () => {
  return gulp.src('_site/**/*.js')
    .pipe(minify({
      ext: {
        min: '.jsm'
      },
      ignoreFiles: ['.min.js', '-min.js']
    }))
    .pipe(gulp.dest('_site/'))
})

gulp.task('cleanjs', () => {
  return del('_site/**/*.js')
})

gulp.task('rename', () => {
  return gulp
    .src('./_site/**/*.jsm')
    .pipe(rename({ extname: '.js' }))
    .pipe(gulp.dest('./_site/'))
})

gulp.task('cleanjsm', () => {
  return del('_site/**/*.jsm')
})

gulp.task('move', () => {
  return gulp
    .src('./_site/_minjs/')
    .pipe(gulp.dest('./_site/'))
})

gulp.task('sass', () => {
  return gulp
    .src('./_site/assets/css/*.css')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./_site/assets/css/'))
})

// Task for building blog when something changed:
gulp.task('jekyll', shell.task('bundle exec jekyll build'))
gulp.task('serve', shell.task('bundle exec jekyll serve --profile --trace --safe --config _config.yml,_config.dev.yml'))
gulp.task('default', gulp.series('jekyll', 'sass', 'minify', 'minjs', 'cleanjs', 'rename', 'cleanjsm'))
