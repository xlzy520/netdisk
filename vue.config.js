'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8000/api`,
        // changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    clientLogLevel: 'warning',
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
}
