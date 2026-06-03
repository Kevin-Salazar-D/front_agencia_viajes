import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      command === 'serve' ? basicSsl() : null,
      obfuscatorPlugin({
      include: ['src/**/*.jsx', 'src/**/*.js'],
      exclude: [/node_modules/],
      
      apply: 'build', 
      
      debugger: false,
      options: {
        compact: true,
        controlFlowFlattening: false, // En false para no hacer la app lenta
        deadCodeInjection: false, 
        debugProtection: false, 
        disableConsoleOutput: true, //  Borrará todos tus console.log en producción
        identifierNamesGenerator: 'hexadecimal', 
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: false, 
        simplify: true,
        splitStrings: true,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ['base64'], 
        stringArrayWrappersCount: 1,
        stringArrayWrappersType: 'variable',
        unicodeEscapeSequence: false
      }
    })
    ],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  }
})