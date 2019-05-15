const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const uglifycss = require("gulp-uglifycss");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

gulp.task("babel-minify", () =>
  gulp.src("./script/script.js")
  .pipe(babel({presets: ["es2015"]}))
  .pipe(uglify({
    mangle: false,
    output: {
      beautify: true,
      comments: true
    }
  }))
  .pipe(gulp.dest("./dist/"))
);
gulp.task("css", done => {
  gulp.src("./css/*.css")
  .pipe(uglifycss({
    "maxLineLen": 80,
    "uglyComments": true
  }))
  .pipe(gulp.dest("./dist/"));
  done();
});

function style(){
  return gulp.src("./scss/main.scss")
  .pipe(sass())
  .pipe(gulp.dest("./css"))
  .pipe(browserSync.stream());
}

function watch(){
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch("./scss/**/*.scss", style);
  gulp.watch("./css/*.css", gulp.series(['css']));
  gulp.watch("./script/*.js", gulp.series(["babel-minify"])).on("change", browserSync.reload);
  gulp.watch("./*.html").on("change", browserSync.reload);
  
}
exports.style = style;
exports.watch = watch;


gulp.task("default", gulp.series([style,"css","babel-minify", watch]));
