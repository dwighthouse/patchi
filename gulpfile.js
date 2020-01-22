const browserify = require('browserify');
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const gulpFile = require('gulp-file');
const rollup = require('rollup');
const vinylBuffer = require('vinyl-buffer');
const vinylSourceStream = require('vinyl-source-stream');
const rollupPluginCommonjs = require('@rollup/plugin-commonjs');
const gulpRename = require('gulp-rename');
const gulpBabel = require('gulp-babel');
const gulpTerser = require('gulp-terser');

const paths = {
    projectRoot: __dirname,
    srcFiles: './src/**/*.*',
    testFiles: './tests/**/*.*',
    testsEntry: './tests/index.js',
    testBrowserDest: './_testing/browser',
    testBrowserDestFiles: './_testing/browser/**/*.*',
    lib: `./src/patchi.js`,
    dist: './dist',
    distFiles: './dist/**/*.*',
};

function onError(e) {
    console.error(e); // eslint-disable-line no-console
    this.emit('end');
}

const applyBabel = (stream) => {
    stream = stream.pipe(gulpBabel({
        presets: [
            ['@babel/env', {
                targets: {
                    browsers: [
                        '> 0.2%, ie >= 9, not ie <= 8, not op_mini all',
                    ],
                },
            }],
        ],
        plugins: [
            '@babel/plugin-transform-object-assign',
        ],
    }));
    stream = stream.on('error', onError);
    return stream;
};

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
    stream = applyBabel(stream);
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



gulp.task('build-clear', () => {
    return del([
        paths.distFiles,
    ]);
});

const buildJs = async (options) => {
    const format = options.format || 'esm';

    const bundle = await rollup.rollup({
        input: options.entry,
        plugins: [
            rollupPluginCommonjs({
                sourceMap: false,
            }),
        ],
    });

    const { output } = await bundle.generate({
        format: format,
        output: {
            name: 'patchi',
        },
    });

    let stream = gulpFile('patchi.js', output[0].code, { src: true });

    stream = stream.pipe(gulpRename({
        suffix: `.${format}`,
    }));

    if (format !== 'esm') {
        stream = applyBabel(stream);
    }

    // Uncompressed form
    stream = stream.pipe(gulp.dest(options.dest));

    // Compressed form
    stream = stream.pipe(gulpTerser({
        mangle: {
            module: format === 'esm',
        },
    }));
    stream = stream.pipe(gulpRename({
        suffix: '.min'
    }));
    stream = stream.pipe(gulp.dest(options.dest));

    return stream;
};

gulp.task('build-esm', async () => {
    return await buildJs({
        entry: paths.lib,
        format: 'esm',
        dest: paths.dist,
    });
});

gulp.task('build-umd', async () => {
    return await buildJs({
        entry: paths.lib,
        format: 'umd',
        dest: paths.dist,
    });
});

gulp.task('build', gulp.series('build-clear', gulp.parallel('build-esm', 'build-umd')));

