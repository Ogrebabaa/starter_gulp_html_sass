// plugins
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify-es').default;
const strip = require('gulp-strip-comments');
const sass = require('gulp-sass')(require('sass'));
const browsersync = require('browser-sync').create();

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
  scss: {
    src: './src/assets/scss/**/*.scss',
    dest: './src/assets/css/',
  },
};

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

function scss() {
  return gulp
    .src(paths.scss.src)
    .pipe(plumber())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browsersync.stream());
}

function css() {
  return (
    gulp
      .src(paths.css.src)
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
      .pipe(uglify())
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
  gulp.watch(paths.scss.src)
    .on('change', () => {
      scss();
      browsersync.reload();
    });
  gulp.watch(paths.html.src)
    .on('change', browsersync.reload);
  gulp.watch(paths.js.src)
    .on('change', browsersync.reload);
}

function clear(done) {
  del.sync([distFolder]);
  done();
}

const launch = gulp.parallel(watch, browserSyncDev);
const dev = gulp.series(scss, launch);
const build = gulp.series(clear, html, css, js, images, browserSyncBuild);
// exports
exports.default = dev;
exports.build = build;
