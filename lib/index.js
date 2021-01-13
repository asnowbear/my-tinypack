
const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

let config = {}

/**
 * 获取文件内容，并解析成ast语法
 * @param {*} fileName 
 */
function getAst(fileName) {
  const content = fs.readFileSync(fileName, 'utf-8')
  // console.log('【content】', content)

  // 使用babylon来解析成ast语法树
  return babylon.parse(content, {
    sourceType: 'module',
  })
}

function getTranslateConde(ast) {
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  return code
}

/**
 * 根据ast得到一个依赖关系视图(数组)
 * @param {*}} ast 
 */
function getDependence(ast) {
  let dependencies = []

  // babel-traverse遍历AST视图，并存储到数组中
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value)
    }
  })
  return dependencies
}

function parse(fileName, entry) {
  let filePath = fileName.indexOf('.js') === -1 ? fileName + '.js' : fileName
  let dirName = entry ? '' : path.dirname(config.entry)
  let absolutePath = path.join(dirName, filePath)
  console.log('【absolute path】', absolutePath)
  const ast = getAst(absolutePath)
  // console.log("【ast】", ast)
  return {
    fileName,
    dependencie: getDependence(ast),
    code: getTranslateConde(ast),
  }
}

function getQueue(main) {
  let queue = [main]
  for (let asset of queue) {
    asset.dependencie.forEach(function(dep) {
      let child = parse(dep)
      queue.push(child)
    })
  }
  return queue
}

function bundle(queue) {
  let modules = ''
  queue.forEach(function(mod) {
    modules += `'${mod.fileName}' : function(require, module, exports) { ${mod.code} },`
  })

  const result = `
    (function(modules) {
      function require(fileName) {
        const fn = modules[fileName];

        const module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
      }

      require('${config.entry}');
    })({${modules}})`;

  return result;
}

function bundleFile(option) {
  config = option
  let mainFile = parse(config.entry, true)
  let queue = getQueue(mainFile)
  return bundle(queue)
}

module.exports = bundleFile
