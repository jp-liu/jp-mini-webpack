# jp-mini-webpack

## 介绍

通过实现一个 `mini-webpack` 学习 `webpack` ,提升代码能力

1. 实现基本打包功能
2. 实现 `loader`,解析非 `js` 文件
3. 实现 `plugins`,提供打包内容加工功能

TODO

1. 循环引用 -- 完成
2. 路径查找规则 -- 完成
3. 发布 npm -- 完成
4. `babel`无法识别`export const xxx = ''`这类语法,明天看下为什么

## 下载

```bash
npm install jp-mini-webpack --save-dev
```

## 运行

```bash
npx jp-webpack
```

## 使用方式

1. `jpMiniWebpack`包提供`jp-webpack`命令行命令,如果没有全局安装请使用`npx jp-webpack or pnpx jp-webpack`
2. `jpMiniWebpack`导出的是一个函数,参数为一个配置信息`config`,配置信息如第二条
3. 配置文件的字段和 `webpack` 一样,自定义方式,在项目根目录中添加 `jp-mini-webpack.config.js`

## 注意

1. 为自己学习项目,欢迎随时交流,有问题反馈等
2. 代码仓库为`https://github.com/jp-liu/jp-mini-webpack`
