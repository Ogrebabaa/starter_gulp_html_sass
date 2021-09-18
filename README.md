# Starter gulp html/sass/js

## Installation

Clone the repo, init a node.js server and configure esLint :
```bash
npm init -y
npm install eslint
npm install dart-sass
./node_modules/.bin/eslint --init
```

## Packages required

```bash
npm install gulp
npm install gulp-plumber
npm install gulp-htmlmin
npm install del
npm install gulp-autoprefixer
npm install gulp-clean-css
npm install gulp-imagemin
npm install gulp-jsmin
npm install gulp-strip-comments
npm install gulp-sass
npm install gulp-w3cjs
```

## Usage

```bash
# gulp default function, run a webserver, live-compile sass, live check w3c rules.
gulp

# for production, make a build version in a 'dist' folder, all minify and comment free.
gulp build
```