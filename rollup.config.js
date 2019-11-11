import resolve from 'rollup-plugin-node-resolve'
import { terser } from "rollup-plugin-terser"
const common = {
  input: 'src/index.js',
  plugins: [
    resolve()
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
    terser()
  ]
})

module.exports = [
  esProdConfig,
  iifeProdConfig
]
