(function (modules) {
    function require(id) {
        const module = {
            exports: {}
        }
        const [fn, mapping] = modules[id]
        function localRequire(filename) {
            const id = mapping[filename]
            return require(id)
        }
        fn(localRequire, module, module.exports)
        return module.exports
    }
    require(1)
})({

    '1':
        [
            function (require, module, exports) {
                "use strict";

                var _foo = require("./foo.js");
                var _md = _interopRequireDefault(require("./md.md"));
                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
                // import { bar } from "./bar.js";

                function main() {
                    console.log('main');
                    console.log(_md["default"]);
                    (0, _foo.foo)();
                }
                main();
            },
            { "./foo.js": 2, "./md.md": 3 }
        ],

    '2':
        [
            function (require, module, exports) {
                "use strict";

                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.foo = foo;
                var _bar = require("./bar.js");
                function foo() {
                    console.log('foo');
                }
            },
            { "./bar.js": 4 }
        ],

    '3':
        [
            function (require, module, exports) {
                "use strict";

                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports["default"] = void 0;
                var _default = "this is a md";
                exports["default"] = _default;
            },
            {}
        ],

    '4':
        [
            function (require, module, exports) {
                "use strict";

                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
                exports.bar = bar;
                function bar() {
                    console.log('bar');
                }
            },
            {}
        ],


})