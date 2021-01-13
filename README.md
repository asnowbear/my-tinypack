# my-tinypack

## 通过一个demo简单理解webpack的核心流程

 - 读取入口文件
 - 对入口文件生成ast
 - 深度递归
 - 生成bundle文件
 - 输出到指定目录

## 重点的几个包

 - bable/parse:用于将源码生成AST
 - bable/traverse：对ast节点进行递归遍历
 - bable-core：转换es6(先换成ast)到es5