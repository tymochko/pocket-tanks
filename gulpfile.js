const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const path = require('path');
const rename = require('gulp-rename');
const templateCache = require('gulp-angular-templatecache');
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');
const inject = require('gulp-inject');

gulp.task('es6', () => {
    gulp.src('src/server/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
    gulp.src('src/client/models/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task( 'sass', () => {
	gulp.src( 'src/client/scss/*.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( gulp.dest( 'public/' ) );
});

gulp.task( 'watch', () => {
    gulp.watch( 'src/client/scss/**/*.scss', ['sass'] );
});

gulp.task('html', () => {
    return gulp.src('src/client/index.html')
        .pipe(inject(
            gulp.src(['main.js', 'main-partials.js', 'main.css'], { read: false, cwd: 'public/' }), {
                 relative: true,
                 ignorePath: '../../',
                 addRootSlash: true
             }
        ))
        .pipe(gulp.dest('public/'));
});

gulp.task('partials', () => {
    return gulp.src('**/*.html', { cwd: 'src/client/modules' })
        .pipe(templateCache({
            module: 'tanks',
            standalone: false,
            moduleSystem: 'IIFE'
        }))
        .pipe(rename('main-partials.js'))
        .pipe(gulp.dest('public/'));
});

gulp.task('browserify', () =>  {
    gulp.src(['src/client/app.js'], { read: false })
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/'));
});

gulp.task('live', () => {
    gulp.watch('src/client/modules/**/*.js', ['browserify']);
});

gulp.task('default', ['es6', 'sass', 'browserify', 'partials', 'html'], () => {
    gulp.watch('src/server/app.js', ['es6']);
});