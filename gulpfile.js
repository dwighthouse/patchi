const browserify = require('browserify');
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const gulpFile = require('gulp-file');
const vinylBuffer = require('vinyl-buffer');
const vinylSourceStream = require('vinyl-source-stream');

const paths = {
    srcFiles: './src/**/*.*',
    testFiles: './tests/**/*.*',
    testsEntry: './tests/index.js',
    testBrowserDest: './_testing/browser',
    testBrowserDestFiles: './_testing/browser/**/*.*',
};

function onError(e) {
    console.error(e); // eslint-disable-line no-console
    this.emit('end');
}

gulp.task('test-clear-browser', () => {
    return del([
        paths.testBrowserDestFiles,
    ]);
});

gulp.task('test-build-js-browser', () => {
    var b = browserify({
        entries: paths.testsEntry,
        debug: false,
    });

    let stream = b.bundle();
    stream = stream.on('error', onError);
    stream = stream.pipe(vinylSourceStream('tests.js'));
    stream = stream.pipe(vinylBuffer());
    stream = stream.pipe(gulp.dest(paths.testBrowserDest));

    return stream;
});

gulp.task('test-build-html-browser', () => {
    return gulpFile('index.html', '<!doctype html><title>In-Browser Testing</title><script src="tests.js"></script>', { src: true })
        .pipe(gulp.dest(paths.testBrowserDest));
});

gulp.task('test-prep-browser', gulp.parallel('test-build-js-browser', 'test-build-html-browser'));

gulp.task('test-serve-browser', () => {
    browserSync.init({
        files: [paths.testBrowserDestFiles],
        reloadDebounce: 1000,
        port: 4000,
        ui: {
            port: 5001,
        },
        server: {
            baseDir: paths.testBrowserDest,
        },
        ghostMode: false,
        snippetOptions: {
            rule: {
                match: /(?:<\/body>)|$/i,
                fn: (snippet, match) => {
                    return '\n\n' + snippet + match;
                },
            },
        },
    });

    gulp.watch([
        paths.srcFiles,
        paths.testFiles,
    ], gulp.series('test-prep-browser')).on('change', browserSync.reload);
});

gulp.task('test-browser', gulp.series(
    'test-clear-browser',
    'test-prep-browser',
    'test-serve-browser',
));
