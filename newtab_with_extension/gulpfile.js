var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del');

// HTML处理
gulp.task('htmls', function() {
    var htmlSrc = './*.html',
        htmlDst = './dist';
    return gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
        // .pipe($.notify({ message: 'Htmls task complete' }));
});

// 样式处理
gulp.task('styles', function() {
    var cssSrc = ['./src/css/*.css','./src/css/*.scss'],
        cssDst = './dist/css';
    return gulp.src(cssSrc)
        .pipe($.sass({ style: 'expanded' }))
        // .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe($.concat('index.css'))
        .pipe(gulp.dest(cssDst))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.minifyCss())
        .pipe(gulp.dest(cssDst))
        // .pipe($.notify({ message: 'Styles task complete' }));
});

// 图片处理
gulp.task('images', function() {
    var imgSrc = './src/img/**/*.{gif,jpeg,jpg,png,svg}',
        imgDst = './dist/img';
    return gulp.src(imgSrc)
        // .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(imgDst))
        // .pipe($.notify({ message: 'Images task complete' }));
})

// js处理
gulp.task('scripts', function() {
    var jsSrc = ['./src/js/common.js',
                    './src/js/const.js',
                    './src/js/dialog.js', 
                    './src/js/notification.js', 
                    './src/js/grid.js', 
                    './src/js/index.js'
                ],
                jsDst = './dist/js';
                
    return gulp.src(jsSrc)
        // .pipe($.jshint())
        // .pipe($.jshint.reporter('default'))
        .pipe($.babel())
        .pipe($.concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglify())
        .pipe(gulp.dest(jsDst))
        // .pipe($.notify({ message: 'Scripts task complete' }));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    return del(['./dist/styles', './dist/scripts', './dist/images']);
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function() {
    gulp.start('htmls', 'styles', 'images', 'scripts', 'watch');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {
    gulp.watch('./*.html', function(event) {
        gulp.run('htmls');
    });
    // 监听css
    gulp.watch(['./src/css/*.scss', './src/css/*.css'], function() {
        gulp.run('styles');
    });
    // 监听images
    gulp.watch('./src/img/**', function() {
        gulp.run('images');
    });
    // 监听js
    gulp.watch('./src/js/*.js', function() {
        gulp.run('scripts');
    });
    // Create LiveReload server
    $.livereload.listen();
    // Watch any files in ./dist/, reload on change
    gulp.watch(['./dist/**/*']).on('change', $.livereload.changed);
});