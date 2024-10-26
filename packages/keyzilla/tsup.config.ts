import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],  
  format: ['cjs', 'esm'],
  dts: true,
  minify: true, // Enable minification
  treeshake: true,  
  
});