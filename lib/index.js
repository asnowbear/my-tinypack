
const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')
const log = console.log

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

/**
 * 使用babel-core来将es6代码转换成es5代码
 * @param {}} ast 
 */
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

/**
 * 单文件解析，并形成文件、ast视图、es5转码结构体
 * @param  fileName 
 * @param {*} entry 
 */
function parse(fileName, entry) {
  let filePath = fileName.indexOf('.js') === -1 ? fileName + '.js' : fileName
  let dirName = entry ? '' : path.dirname(config.entry)
  let absolutePath = path.join(dirName, filePath)
  log('【解析文件路径】', absolutePath)

  const ast = getAst(absolutePath)
  // console.log("【ast】", ast)
  return {
    fileName,
    dependencie: getDependence(ast),
    code: getTranslateConde(ast),
  }
}

// 深度递归
function getQueue(main) {
  let queue = [main]
  for (let asset of queue) {
    // log('文件',asset.fileName, '长度', asset.dependencie.length)
    asset.dependencie.forEach(function(dep) {
      let child = parse(dep)
      queue.push(child) // 深度递归的关键
    })
  }

  // log('最终长度', queue.length)
  return queue
}

/**
 * 拼接到一个bundle文件中，即打捆
 * @param {}} queue 
 */
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
  let mainFile = parse(config.entry, true) // 解析入口文件
  let queue = getQueue(mainFile) // 深度递归
  return bundle(queue) // 打捆
}

module.exports = bundleFile
