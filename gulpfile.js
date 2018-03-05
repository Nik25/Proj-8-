'use strict';

 var gulp   = require('gulp');
 var concat = require('gulp-concat');
 var uglify = require('gulp-uglify');
 var maps   = require ('gulp-sourcemaps'); 
 var sass   = require ('gulp-sass');
 var csso   = require ('gulp-csso');
 var autoprefixer = require('gulp-autoprefixer');
 var del    = require('del');  
 var imagemin = require('gulp-imagemin');   
 var browserSync = require('browser-sync').create();
 
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
1) Runs the gulp scripts command at the command line to concatenate, 
minify, and copy all of the project’s JavaScript files into an
all.min.js file that is then copied to the dist/scripts folder.
2) Source maps are generated for the JavaScript files.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

gulp.task('scripts', () => {
  return gulp.src('js/**/*.js')
  .pipe(maps.init())  
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/scripts'));
});

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
1) When gulp styles command is run at the command line to compile the project’s SCSS files
into CSS,then concatenate and minify into an all.min.css file that is then copied to 
the dist/styles folder.
2) When gulp styles command is run at the command line, source maps are generated the CSS
files respectively.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

gulp.task('styles', () => {
  return gulp.src ('./sass/**/*.scss')
 .pipe(maps.init())
 .pipe(sass())
 .pipe(autoprefixer())
 .pipe(concat('all.min.css'))
 .pipe(csso())
 .pipe(maps.write('./'))
 .pipe(gulp.dest('dist/styles'))
}); 


/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
1) When the gulp images command is run at the command line it optimizes the size of the
project’s JPEG and PNG files, and then copies those optimized images to the 
dist/content folder. 

2) Icons directory -- you can ignore this folder in your build process, but you will need
 to copy this folder over to the dist directory for the final build
 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/ 


gulp.task('images', ['icons'], () => {
   return gulp.src('images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/content'));
});

gulp.task('icons', () => {
  return gulp.src('icons/**/*')
  .pipe(gulp.dest('dist/content/icons'));
});

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
When the gulp clean command is run at the command line it deletes all of the files
and folders in the dist folder.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

gulp.task('clean', () => {
  return del('dist/*');
});

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
When the gulp build command is run at the command line it runs the clean, scripts,
styles, and images tasks with confidence and the clean task completes before 
the other commands.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/ 

gulp.task('build',['clean'], () => {
gulp.start(['scripts', 'styles', 'images']);
return gulp.src(['index.html'], {base: './'})
.pipe(gulp.dest('dist/'));
});

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
When the gulp command is run at the command line to run the build task
then it will serve the project using a local web server.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

gulp.task('serve', ['build'], () => {
   return browserSync.init({
    server: {
        baseDir: "./"
    }
  });
});

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
When the default gulp command is run, it should continuously watch for changes 
to any .scss file in my project. When there is a change to one of the .scss files,
the gulp styles command is run and the files are compiled, concatenated,
and minified to the dist folder. The project should then reload in the browser,
displaying the changes.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

gulp.task('watch', () => {
gulp.watch('sass/**/*.scss', ['styles']);
 });

gulp.task('default', ['watch', 'serve']);
   
