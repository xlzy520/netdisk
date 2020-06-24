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
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '/api': {
        target: `http://localhost:5000`,
        // changeOrigin: true,
        pathRewrite: {
          ['^' + '/api']: ''
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
