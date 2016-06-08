const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const browserify = require('gulp-browserify'),
    concat = require('gulp-concat');

gulp.task('es6', () => {
    return gulp.src('src/server/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task( 'sass', () => {
	gulp.src( 'src/client/scss/style.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( gulp.dest( 'public/stylesheets/' ) );
});

gulp.task( 'watch', () => {
    gulp.watch( 'src/client/scss/**/*.scss', ['sass'] );
});

gulp.task('browserify', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    gulp.src(['src/client/app/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        // Bundle to a single file
        .pipe(concat('bundle.js'))
        // Output it to our dist folder
        .pipe(gulp.dest('public/js'));
});

gulp.task('default', ['es6'], () => {
    gulp.watch('src/app.js', ['es6'])
});