// plugins
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const jsmin = require('gulp-jsmin');
const strip = require('gulp-strip-comments');
const sass = require('gulp-sass')(require('sass'));

const distFolder = './dist/';
const paths = {
  css: {
    src: './src/assets/css/**/*.css',
    dest: './dist/assets/css/',
  },
  html: {
    src: './src/**/*.html',
    dest: './dist/',
  },
  js: {
    src: './src/assets/js/**/*.js',
    dest: './dist/assets/js/',
  },
  sass: {
    src: './src/assets/sass/**/*.scss',
    dest: './dist/assets/sass/',
  },
};

// install du plugin
const browsersync = require('browser-sync').create();
// variables
const srcFolder = './src/';
const srcFolderBuild = './dist/';
// BrowserSync
function browserSyncDev() {
  browsersync.init({
    server: {
      baseDir: srcFolder,
    },
    port: 3000,
  });
}
function browserSyncBuild() {
  browsersync.init({
    server: {
      baseDir: srcFolderBuild,
    },
    port: 3000,
  });
}

function html() {
  return (
    gulp
      .src(paths.html.src, { since: gulp.lastRun(html) })
      .pipe(plumber())
      .pipe(strip())
      .pipe(gulp.dest(paths.html.dest))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'))
      .pipe(browsersync.stream())
  );
}

function buildStyles() {
  return gulp.src(paths.sass.src, { since: gulp.lastRun(buildStyles) })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/assets/css'));
}

function css() {
  return (
    gulp
      .src(paths.css.src, { since: gulp.lastRun(css) })
      .pipe(autoprefixer({
        cascade: false,
      }))
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(gulp.dest('dist/assets/css'))
      .pipe(browsersync.stream())
  );
}
function js() {
  return (
    gulp
      .src(paths.js.src, { since: gulp.lastRun(js) })
      .pipe(jsmin())
      .pipe(gulp.dest('dist/assets/js'))
      .pipe(browsersync.stream())
  );
}

function images() {
  return (
    gulp
      .src('./src/assets/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/assets/img'))
  );
}

function watch() {
  gulp.watch([paths.css.src, paths.html.src, paths.js.src, paths.sass.src])
    .on('change', browsersync.reload);
  gulp.watch(
    paths.sass.src,
    buildStyles,
  );
}

function watchFile() {
  gulp.watch(
    paths.sass.src,
    buildStyles,
  );
  gulp.watch(
    paths.css.src,
    css,
  );
  gulp.watch(
    paths.html.src,
    html,
  );
  gulp.watch(
    paths.js.src,
    js,
  );
}

function clear(done) {
  del.sync([distFolder]);
  done();
}

// exports
const dev = gulp.parallel(watch, browserSyncDev);
const devDist = gulp.parallel(watchFile, browserSyncBuild);
exports.buildStyles = buildStyles;
exports.clear = clear;
exports.watch = watch;
exports.default = dev;
exports.devDist = devDist;
exports.browserSyncDev = browserSyncDev;
exports.html = html;
exports.css = css;
const build = gulp.series(clear, html, css, js, images);
exports.build = build;
