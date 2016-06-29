const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const browserify = require('gulp-browserify');
const templateCache = require('gulp-angular-templatecache');

gulp.task('es6', () => {
    gulp.src('src/server/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
    // gulp.src('src/client/models/*.js')
    //     .pipe(babel({
    //         presets: ['es2015']
    //     }))
    //     .pipe(gulp.dest('public/scripts'));
});

gulp.task( 'sass', () => {
    gulp.src( 'src/client/scss/*.scss' )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( gulp.dest( 'public/' ) );
});

gulp.task('template', () => {
    return gulp.src('**/*.html', { cwd: 'src/client/modules' })
        .pipe(templateCache({
            module: 'tanks',
            standalone: false,
            moduleSystem: 'IIFE'
        }))
        .pipe(rename('main-partials.js'))
        .pipe(gulp.dest('public/'));
});

gulp.task('js', () =>  {
    gulp.src(['src/client/app.js', 'src/client/models/*.js'], { read: false })
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/'));
});

gulp.task('build', ['sass', 'template', 'js'], () => {
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

gulp.task('default', ['es6', 'build'], () => {
    gulp.watch('src/server/app.js', ['es6']);
    gulp.watch('src/client/modules/**/*.js', ['js']);
    gulp.watch('src/client/modules/**/*.html', ['template'] );
    gulp.watch('src/client/scss/**/*.scss', ['sass'] );
});
