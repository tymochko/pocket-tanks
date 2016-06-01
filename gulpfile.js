const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

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

gulp.task('default', ['es6'], () => {
    gulp.watch('src/app.js', ['es6'])
});