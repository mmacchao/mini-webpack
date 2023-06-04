(function(modules) {
    function require(id) {
        const module = {
            exports: {}
        }
        const [fn, mapping] = modules[filename]
        const filename = mapping[id]
        function localRequire(filename) {
            fn(localRequire, module, module.exports)
            return module.exports
        }
        require(1)
    }
})({
    './foo.js': function(require, modules, exports) {
        exports.foo =  function foo() {
            console.log('foo')
        }
    },
    './main.js': function(require, module, exports) {
        const {foo} = require('./foo.js')
        function main() {
            console.log('main')
        }
        foo()
    }
})