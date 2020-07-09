var gulp = require("gulp");
var shell = require("gulp-shell");
var browserSync = require("browser-sync").create();
var load = require("gulp-load-plugins")();
var autoprefixer = require("autoprefixer");
var sass = require("gulp-sass");
var minify = require("gulp-minify");
var rename = require("gulp-rename");
sass.compiler = require("node-sass");
var sassPaths = ["assets", "_sass"];
var del = require('del');
const htmlmin = require("gulp-htmlmin");

gulp.task("minify", () => {
  return gulp
    .src("_site/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest("_site"));
});

gulp.task('minjs', function () {
  return gulp.src("_site/**/*.js")
    .pipe(minify({
      ext: {
        min: ".jsm"
      },
      ignoreFiles: [".min.js", "-min.js"]
    }))
    .pipe(gulp.dest("_site/"))
});

gulp.task('cleanjs', function () {
  return del("_site/**/*.js");
});

gulp.task("rename", function () {
  return gulp
    .src("./_site/**/*.jsm")
    .pipe(rename({ extname: ".js" }))
    .pipe(gulp.dest("./_site/"))
});

gulp.task('cleanjsm', function () {
  return del("_site/**/*.jsm");
});

gulp.task("move", function () {
  return gulp
    .src("./_site/_minjs/")
    .pipe(gulp.dest("./_site/"));
});

gulp.task("sass", function () {
  return gulp
    .src("./_site/assets/css/*.css")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./_site/assets/css/"));
});


// Task for building blog when something changed:
gulp.task("jekyll", shell.task("bundle exec jekyll build"));
gulp.task("serve", shell.task("bundle exec jekyll serve"));
// If you don't use bundle:
// gulp.task('build', shell.task(['jekyll serve']));
// If you use  Windows Subsystem for Linux (thanks @SamuliAlajarvela):
// gulp.task('build', shell.task(['bundle exec jekyll serve --force_polling']));

// Task for serving blog with Browsersync

// gulp.task("serve", function () {
//   browserSync.init({
//     server: { baseDir: "./" },
//     ui: { port: 4001 },
//     port: 4000,
//   });
//   gulp.watch("_site/**/*.*").on("change", browserSync.reload);
// });
/* gulp.task("sass", sass); */
gulp.task("default", gulp.series("jekyll", "sass", "minify", "minjs", "cleanjs", "rename", "cleanjsm"));