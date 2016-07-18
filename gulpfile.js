const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('gulp-browserify');
// const browserify = require('browserify');
const templateCache = require('gulp-angular-templatecache');
const Server = require('karma').Server;

const fs = require('fs');
var files = fs.readdirSync(path.join(__dirname, 'src/client/models'));
files = files.map(function(item) {
    return 'src/client/models/' + item;
});

gulp.task('es6', () => {
    // gulp.src('src/server/app.js')
    //     .pipe(babel({
    //         presets: ['es2015']
    //     }))
    //     .pipe(gulp.dest('dist'));
    // gulp.src('src/client/models/*.js')
    //     .pipe(babel({
    //         presets: ['es2015']
    //     }))
    //     .pipe(gulp.dest('public/scripts'));
});

gulp.task('fonts', () => {
  return gulp.src('src/client/fonts/*')
    .pipe(gulp.dest('public/fonts'));
});

gulp.task( 'sass', () => {
    gulp.src( 'src/client/scss/*.scss' )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( gulp.dest( 'public/' ) );
});

gulp.task('images', () => {
     return gulp.src('src/client/images/*')
         .pipe(gulp.dest('public/images'));
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
    gulp.src('src/client/app.js', { read: false })
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/'))
});

gulp.task('js-models', () => {
    gulp.src('src/client/models/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main-models.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/'));
});

// gulp.task('js', () => {
//     files.push('src/client/app.js');
//     return browserify({ entries: files, debug: true }).
//         // transform(babelify, { presets: ['es2015'] }).
//         bundle().
//         pipe(source('main.js')).
//         pipe(buffer()).
//         pipe(sourcemaps.init({ loadMaps: true })).
//         pipe(sourcemaps.write('.')).
//         pipe(gulp.dest('public/'))
// });

gulp.task('build', ['fonts', 'sass', 'images', 'template', 'js', 'js-models'], () => {
    return gulp.src('src/client/index.html')
        .pipe(inject(
            gulp.src(['main.js', 'main-partials.js', 'main.css', 'main-models.js'], { read: false, cwd: 'public/' }), {
                relative: true,
                ignorePath: '../../',
                addRootSlash: true
             }
        ))
        .pipe(gulp.dest('public/'));
});

gulp.task('test', function (done) {
    new Server({
        configFile:__dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', ['es6', 'build']);

gulp.task('watch', () => {
    gulp.watch('src/server/app.js', ['es6']);
    gulp.watch('src/client/modules/**/*.js', ['js']);
    gulp.watch('src/client/modules/**/*.html', ['template'] );
    gulp.watch('src/client/scss/**/*.scss', ['sass'] );
    gulp.watch('src/client/models/*.js', ['js-models'] );
});
