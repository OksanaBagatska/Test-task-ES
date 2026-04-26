const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');

// --------------------
// STYLES (SCSS → CSS)
// --------------------
gulp.task('styles', function () {
    return gulp.src('assets/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('assets/dist/css'));
});

// --------------------
// SCRIPTS (JS → bundle)
// --------------------
gulp.task('scripts', function () {
    return gulp.src('assets/scripts/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/dist/js'));
});

// --------------------
// IMAGES (compress)
// --------------------
gulp.task('images', function () {
    return gulp.src('assets/img/**/*.{jpg,jpeg,png,gif,svg}')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 80, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { name: 'removeViewBox', active: false },
                    { name: 'cleanupIDs', active: false }
                ]
            })
        ]))
        .pipe(gulp.dest('assets/dist/img'));
});

// --------------------
// FIX IMAGE PATHS (assets/img/ → assets/dist/img/)
// --------------------
gulp.task('fix-paths', function () {
    return gulp.src('./index.html')
        .pipe(replace(/(['"])\.\/assets\/img\//g, '$1./assets/dist/img/'))
        .pipe(gulp.dest('./'));
});

// --------------------
// INJECT (CSS + JS → HTML)
// --------------------
gulp.task('inject', function () {
    const target = gulp.src('./index.html');
    const sources = gulp.src([
        'assets/dist/css/style.css',
        'assets/dist/js/main.js'
    ], { read: false });

    return target
        .pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('./'));
});

// --------------------
// DEV SERVER
// --------------------
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 8081,
        open: true,
        notify: false
    });

    gulp.watch(
        'assets/styles/**/*.scss',
        gulp.series('styles', 'inject', function reload(done) {
            browserSync.reload();
            done();
        })
    );

    gulp.watch(
        'assets/scripts/*.js',
        gulp.series('scripts', 'inject', function reload(done) {
            browserSync.reload();
            done();
        })
    );

    gulp.watch(
        'assets/img/**/*.{jpg,jpeg,png,gif,svg}',
        gulp.series('images', function reload(done) {
            browserSync.reload();
            done();
        })
    );

    gulp.watch('./*.html').on('change', browserSync.reload);
});

// --------------------
// DEFAULT TASK
// --------------------
gulp.task('default', gulp.series(
    gulp.parallel('styles', 'scripts', 'images'),
    'fix-paths',
    'inject',
    'serve'
));