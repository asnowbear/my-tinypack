
    (function(modules) {
      function require(fileName) {
        const fn = modules[fileName];

        const module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
      }

      require('./src/index.js');
    })({'./src/index.js' : function(require, module, exports) { "use strict";

var _test = require("./test.js");

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_test2.default); },'./test.js' : function(require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _message = require("./message.js");

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const b = 'hello' + ' world'
var a = 'hello' + new _message2.default().prop1;

exports.default = a; },'./message.js' : function(require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const b = 'world'

// export default b


var A = function () {
  function A() {
    _classCallCheck(this, A);

    this.prop1 = 1;
  }

  _createClass(A, [{
    key: "prop1",
    get: function get() {
      return this.prop1;
    }
  }]);

  return A;
}();

exports.default = A; },})