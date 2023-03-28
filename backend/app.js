//  app.js

// 注意，启动文件必须用 require
require("babel-register")
({
    'presets': ["es2015"],
})
require('module-alias/register')
// 引入 koa 的主文件
require('./server.js')





