import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from "rollup-plugin-terser"

const common = {
  input: 'src/index.js',
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',  
      sourceMap: false
    })
  ]
}

const esProdConfig = Object.assign({}, common, {
  output: {
    file: 'dist/auto-layouter.cjs.js',
    format: 'cjs'
  }
})

const iifeProdConfig = Object.assign({}, common, {
  output: {
    name: 'al',
    file: 'dist/auto-layouter.min.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    terser(),
    commonjs({
      include: 'node_modules/**',  
      sourceMap: false
    })
  ]
})

module.exports = [
  esProdConfig,
  iifeProdConfig
]
