import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      command === 'serve' ? basicSsl() : null
    ],
  }
})