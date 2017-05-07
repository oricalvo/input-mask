let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
    entry: 'input-mask.js',
    targets: [
        {
            dest: "dist/input-mask.umd.js",
            moduleName: "input-mask",
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
