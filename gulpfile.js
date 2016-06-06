const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

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
		.pipe( gulp.dest( 'public/stylesheets/' ) );
});

gulp.task( 'watch', () => {
    gulp.watch( 'src/client/scss/**/*.scss', ['sass'] );
});

gulp.task('default', ['es6', 'sass'], () => {
    gulp.watch('src/app.js', ['es6'])
});