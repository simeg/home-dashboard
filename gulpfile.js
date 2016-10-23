'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var paths = {
    server: './index.js',
    scripts: ['./*.js'],
    templates: ['./views/*.pug'],
    styles: ['./views/*.less']
};

gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(livereload());
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(livereload());
});

gulp.task('templates', function() {
    return gulp.src(paths.templates)
        .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.templates, ['templates']);
});

gulp.task('server', function() {
    nodemon({
        'script': paths.server
    }).on('start', function() {
        gulp.src(paths.server)
            .pipe(livereload());
    });
});

gulp.task('serve', ['server', 'watch']);

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint('./.eslintrc'))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test', function() {
    gulp.src('./tests/*.js', {read: false})
        .pipe(mocha({reporter: 'landing'}));
});
