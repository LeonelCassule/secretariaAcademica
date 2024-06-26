import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;
const minify = !!process.env.minify;

export default {
    input: 'main.js',
    output: {
        sourcemap: !production || minify,
        name: 'bookly',
        format: 'iife',
        file: !production || minify ? '../bookly.min.js' : '../bookly.js',
        globals: {
            jquery: 'jQuery'
        },
        banner: 'const booklyJsVersion="' + (new Date()).toISOString().slice(0, 10) + '";' + "\n/*!*/",
    },
    external: ['jquery'],
    plugins: [
        svelte({
            // enable run-time checks when not in production
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
            emitCss: false,
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        production && babel({
            extensions: ['.js', '.mjs', '.html', '.svelte'],
            babelHelpers: 'runtime',
            // babelHelpers: 'bundled',
            exclude: ['node_modules/@babel/**', 'node_modules/core-js-pure/**', '../../../../../../../assets/js/node_modules/@babel/**', '../../../../../../../assets/js/node_modules/core-js-pure/**'],
            presets: [
                ['@babel/preset-env', {
                    targets: production ? '> 0.25%, not dead' : 'supports es6-module',
                    // modules: false,
                    // spec: true,
                    // forceAllTransforms: true,
                    // useBuiltIns: 'usage',
                    shippedProposals: true,
                    // corejs: 3
                }]
            ],
            plugins: [
                ['@babel/plugin-transform-runtime', {
                    useESModules: true,
                    corejs: 3
                }]
            ]
        }),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('..'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        minify && terser()
    ],
    watch: {
        clearScreen: false
    }
};
