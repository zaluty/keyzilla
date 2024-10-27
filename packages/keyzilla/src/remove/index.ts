#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
 
export async function removeKeyzilla() {
  const projectRoot = process.cwd();

  // Step 1: Find all TypeScript and JavaScript files
  const files = await glob('* */*.{ts,js,tsx,jsx}', { ignore: ['**/node_modules/**', '**/dist/**'] });

  // Step 2: Replace k. with process.env. and ensure it is not undefined
  for (const file of files) {
    const filePath = path.join(projectRoot, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace all occurrences of k. with process.env. and add a non-null assertion operator (!)
    content = content.replace(/k\./g, 'process.env.' + "!");
    fs.writeFileSync(filePath, content);
  }
 
  console.log('Keyzilla removal process completed:');
  console.log('Replaced all k. occurrences with process.env.');
}

removeKeyzilla().then(() => {
  console.log('Keyzilla removal process completed');
}).catch((error) => {
  console.error('Error removing Keyzilla:', error);
});
