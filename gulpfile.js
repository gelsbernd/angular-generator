/*
 var gulp = require('gulp'),
 sass = require('gulp-sass'),
 inject = require('gulp-inject'),
 wiredep = require('wiredep').stream,
 browserSync = require('browser-sync'),
 reload = browserSync.reload;

 var paths = {
 scripts: ['modules/!**!/!*.module.js', 'modules/!**!/!*.js', '!modules/!**!/!*.test.js', '!modules/!**!/!*.spec.js'],
 html: ['index.html', 'modules/!**!/!*.html'],
 sass: ['scss/!**!/!*.scss'],
 unitTests: ['modules/!**!/!*.test.js']
 }

 gulp.task('sass', function(){
 return gulp.src(paths.sass)
 .pipe(sass())
 .pipe(gulp.dest('assets/css'))
 .pipe(reload({stream:true}));
 });

 gulp.task('inject', function(){
 return gulp.src('./index.html')
 .pipe(inject(gulp.src(paths.scripts, {read:false})))
 .pipe(gulp.dest('./'));
 });

 gulp.task('wiredep', function(){
 return gulp.src('./index.html')
 .pipe(wiredep({
 directory: './lib/',
 bowerJson: require('./bower.json')
 }))
 .pipe(gulp.dest('./'));
 });

 gulp.task('browser-sync', function(){
 browserSync({
 server: {
 baseDir: './'
 }
 });
 });

 gulp.task('dev', ['sass', 'inject', 'wiredep', 'browser-sync'], function(){
 gulp.watch(paths.sass, ['sass']);
 gulp.watch(paths.html, [reload]);
 gulp.watch(paths.scripts, ['inject', reload]);
 });*/

var gulp = require('gulp'),
  clean = require('rimraf'),
  annotate = require('gulp-ng-annotate'),
  minify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  autoprefix = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  inject = require('gulp-inject'),
  karma = require('gulp-karma'),
  connect = require('gulp-connect'),
  protractor = require('gulp-protractor').protractor,
  webdriver_update = require('gulp-protractor').webdriver_update,
  wiredep = require('wiredep').stream,
  browserSync = require('browser-sync'),
  build = require('gulp-build'),
  imagemin = require('gulp-imagemin'),
  tar = require('gulp-tar'),
  gzip = require('gulp-gzip'),
  gulpSequence = require('gulp-sequence');
reload = browserSync.reload;

var paths = {
  scripts: ['src/app.js',
    'src/fakeData.js',
    'src/app-controller.js',
    'src/modules/**/*.js',
    '!src/modules/**/*.test.js',
    '!src/modules/**/*.spec.js'],
  css: ['src/css/*.css'],
  sass: ['src/scss/**/*.scss'],
  html: ['src/**/*.html'],
  unitTests: ['src/modules/**/*.test.js'],
  images: ['src/img/**/*.png','!src/img/favicons/*.*']
};
gulp.task('clean', function (cb) {
  clean('dist', cb);
});

gulp.task('minify-js', function(){
  gulp.src(paths.scripts)
    .pipe(annotate({add:true, single_quotes:true}))
    .pipe(minify())
    .pipe(concat('app.all.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function(){
  gulp.src(paths.sass)
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(reload({stream: true}));
});

gulp.task('inject', function () {
  return gulp.src('src/index.html')
    .pipe(inject(gulp.src(paths.scripts, {read: false}), {ignorePath: '/src/',addRootSlash:false}))
    .pipe(gulp.dest('src/'));
});

gulp.task('wiredep', function () {
  return gulp.src('./src/index.html')
    .pipe(wiredep({
      directory: './src/lib/',
      bowerJson: require('./bower.json')
    }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'src/'
    }
  });
});

gulp.task('test:unit', function () {
  return gulp.src('./foobar')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      this.emit('end'); //instead of erroring the stream, end it
    });
});

gulp.task('tdd', ['test:unit'], function () {
  gulp.watch(paths.unitTests, ['test:unit']);
  gulp.watch(paths.scripts, ['test:unit']);
});

gulp.task('dev', ['sass', 'inject', 'wiredep', 'browser-sync'], function () {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch(paths.html, [reload]);
  gulp.watch(paths.scripts, ['inject', reload]);
});

/* Tasks to support jenkins*/

gulp.task('move-bower', function () {
  gulp.src('src/lib/**/*.*')
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('move-images', function () {
  gulp.src(['src/img/**/*.*'])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('move-css', function () {
  gulp.src('src/**/*.css')
    .pipe(gulp.dest('dist/'));
});

gulp.task('move-html', function () {
  gulp.src('src/**/*.html')
    /*      .pipe(build({ title: 'Some page' })) */
    .pipe(gulp.dest('dist/'));
});

gulp.task('move-js', function () {
  gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task('freshbuild',['sass','inject','move-images','move-bower','move-css','move-html','move-js']);

gulp.task('tarball', function() {
  gulp.src('./dist/*')
    .pipe(tar('archive.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', gulpSequence('clean', 'freshbuild', 'tarball'));
