let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
    entry: 'dist/index.js',
    external: [
        "tslib",
    ],
    globals: {
        tslib: ''
    },
    targets: [
        {
            dest: "dist/input-mask.umd.js",
            moduleName: "inputMask",
            format: 'umd',
            sourceMap: true
        },
        {
            dest: "dist/input-mask.es6.js",
            format: 'es',
            sourceMap: true
        }
    ]
};
