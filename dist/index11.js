
(function(modules) {
  
  function require(fileName) {
    const fn = modules[fileName];

    const module = { exports: {} };

    fn(require, module, module.exports);

    return module.exports;
  }

  require('./src/index.js');
})(
  {
  './src/index.js' : function(require, module, exports) {
      "use strict";

      var _test = require("./test.js");

      var _test2 = _interopRequireDefault(_test);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      console.log(_test2.default); 
    },
  './test.js' : function(require, module, exports) { 
      "use strict";

      // writable enumerable configurable采用默认值， 
      //表示 __esModule属性，不能遍历、删除，并且只读
      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _message = require("./message.js");

      var _message2 = _interopRequireDefault(_message);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      // const b = 'hello' + ' world'
      var a = 'hello' + _message2.default;

      exports.default = a; 
    },
  './message.js' : function(require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var b = 'world';

      exports.default = b; 
    },
  }
)