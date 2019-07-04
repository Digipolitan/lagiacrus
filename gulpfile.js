const gulp = require('gulp');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const mergeStream = require('merge-stream');
const file = require('gulp-file');
const spawn = require('child_process').spawn;

const gulpDependencies = [
    'del',
    'gulp',
    'gulp-rename',
    'gulp-sourcemaps',
    'gulp-typescript',
    'gulp-uglify',
    'merge-stream',
    'gulp-file'
];

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('clean', () => {
    return del('dist');
});

gulp.task('compile', () => {
    const tsResult = tsProject.src().pipe(tsProject());
    let jsStream = tsResult.js;
    if (tsProject.options.sourceMap === true) {
        jsStream = jsStream.pipe(sourcemaps.init())
    }
    jsStream = jsStream.pipe(uglify());
    if (tsProject.options.sourceMap === true) {
        jsStream = jsStream.pipe(sourcemaps.write('.'))
    }
    return mergeStream(
        tsResult.dts,
        jsStream
    ).pipe(gulp.dest(tsProject.options.outDir + '/lib'))
});

gulp.task('npm-files', () => {
   return gulp.src(['LICENSE', 'README.md'])
       .pipe(gulp.dest(tsProject.options.outDir));
});

gulp.task('package', () => {
    const package = require('./package.json');
    for (let gulpDependency of gulpDependencies) {
        delete package.devDependencies[gulpDependency];
    }
    package.main = 'lib/index.js';
    if (tsProject.options.declaration === true) {
        package.types = 'lib/index.d.ts';
    }
    return file('package.json', JSON.stringify(package, null, 2), { src: true })
        .pipe(gulp.dest(tsProject.options.outDir));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('compile', 'npm-files', 'package')
));

gulp.task('publish', (done) => {
    spawn('npm', ['publish', 'dist'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('build-publish', gulp.series(
    'default',
    'publish'
));