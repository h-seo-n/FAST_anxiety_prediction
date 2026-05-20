import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` must match the GitHub Pages path. A project site is served at
// https://<user>.github.io/<repo>/, so base = '/<repo>/'.
// Repo: FAST_anxiety_prediction — change this string if you rename the repo.
// The dev server stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/FAST_anxiety_prediction/' : '/',
  plugins: [react()],
}))
