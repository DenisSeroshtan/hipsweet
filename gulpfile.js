var gulp = require('gulp'),
    clean = require('gulp-clean'),
    plumberNotifier = require('gulp-plumber-notifier'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    wiredep = require('gulp-wiredep'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglifyjs'), 
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');
//________________________/svg/______________________//
var svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');

//________________________/dev/______________________//

gulp.task('default', ['watch']);

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('_dev/css/**/*.scss', ['sass']);
    gulp.watch(['./bower.json','_dev/*.html'], ['html']).on('change', browserSync.reload);
    gulp.watch('_dev/js/**/*.js').on('change', browserSync.reload); 
});

gulp.task('sass', function() {
    return gulp.src('./_dev/**/main.scss')
        .pipe(plumberNotifier())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7']))
        .pipe(sourcemaps.write())
    .pipe(gulp.dest('_dev/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function() {
    return gulp.src('./_dev/*.html')
        .pipe(wiredep({
            directory: '_dev/bower/'
        }))
        .pipe(gulp.dest('./_dev'))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        port: 9000,
        server: {
            baseDir: './_dev/'
        },
        notify: false
    });
});

//________________________/build/______________________//
gulp.task('production', ['clean'], function() {
    gulp.run('build');
});

gulp.task('build', ['vendor', 'styles', 'scripts', 'assets']);

gulp.task('vendor', ['html'], function() {
    return gulp.src('_dev/index.html')
        .pipe(useref())
        .pipe(gulp.dest('build/'))
        .on('end', function() {
            gulp.run('vendorMinCss', 'vendorMinJs');
        });
});

gulp.task('styles', ['sass'], function() {
    return gulp.src('./_dev/**/main.css')
        .pipe(cssnano())
        .pipe(gulp.dest('./build'));
});

gulp.task('scripts', function() {
    return gulp.src('./_dev/js/**/*.js')
        .pipe(plumberNotifier())
        .pipe(gulp.dest('build/js'));
});

gulp.task('assets', ['img'], function() {
    return gulp.src('./_dev/{fonts,svg}/**/*.*')
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorMinCss', function() {
    return gulp.src('./build/**/vendor.css')
        .pipe(cssnano())
        .pipe(gulp.dest('./build/'));
});

gulp.task('vendorMinJs', function() {
    return gulp.src('./build/**/vendor.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));
});

gulp.task('clear', function(callback) {
    return cache.clearAll();
});

gulp.task('clean', function() {
    return gulp.src('build/')
        .pipe(clean());
});
//________________________/png/______________________//
gulp.task('img', function() {
    return gulp.src('_dev/png/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('build/png'));
});
//________________________/svg/______________________//
var config = {
  mode: {
    symbol: {
      sprite: "../sprite.svg",
      render: {
        scss: {
          dest: '../../../../css/plugins/_sprite.scss'
        }
      }
    }
  }
};

gulp.task('svgSpriteBuild', function() {
  return gulp.src('_dev/svg/icons/ing/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite(config))
    .pipe(gulp.dest('_dev/svg/icons/sprite/'));
});

//________________________/error/______________________//
var log = function(error) {
  console.log([
    '',
    "----------ERROR MESSAGE START----------",
    ("[" + error.name + " in " + error.plugin + "]"),
    error.message,
    "----------ERROR MESSAGE END----------",
    ''
  ].join('\n'));
  this.end();
}