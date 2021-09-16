// plugins
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

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
      .pipe(gulp.dest(paths.html.dest))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'))
      .pipe(browsersync.stream())
  );
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

function images() {
  return (
    gulp
      .src('./src/assets/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/assets/img'))
  );
}

function watch() {
  gulp.watch([paths.css.src, paths.html.src])
    .on('change', browsersync.reload);
}

function watchFile() {
  gulp.watch(
    paths.css.src,
    css,
  );
  gulp.watch(
    paths.html.src,
    html,
  );
}

function clear(done) {
  del.sync([distFolder]);
  done();
}

// exports
const dev = gulp.parallel(watch, browserSyncDev);
const devDist = gulp.parallel(watchFile, browserSyncBuild);
exports.clear = clear;
exports.watch = watch;
exports.default = dev;
exports.devDist = devDist;
exports.browserSyncDev = browserSyncDev;
exports.html = html;
exports.css = css;
const serie = gulp.series(clear, html, css, images);
const build = gulp.series(serie, gulp.parallel(watchFile, browserSyncBuild));
exports.build = build;
