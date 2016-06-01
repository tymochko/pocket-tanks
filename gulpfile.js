const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

gulp.task('es6', () => {
    return gulp.src('src/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build'));
});

gulp.task( 'sass', () => {
	gulp.src( 'src/scss/main.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( gulp.dest( 'src/public/stylesheets/' ) );
});

gulp.task('default', ['es6'], () => {
    gulp.watch('src/app.js', ['es6']);
    gulp.watch( 'src/scss/**/*.scss', ['sass'] );
});
