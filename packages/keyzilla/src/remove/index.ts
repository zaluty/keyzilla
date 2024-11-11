#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
 
export async function removeKeyzilla() {
  const projectRoot = process.cwd();
  const files = await glob('**/*.{ts,js,tsx,jsx}', { ignore: ['**/node_modules/**', '**/dist/**'] });

  for (const file of files) {
    const filePath = path.join(projectRoot, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      content = content.replace(/k\.(\w+)/g, 'process.env.$1 as string');
    } else {
      content = content.replace(/k\.(\w+)/g, 'process.env.$1');
    }
    fs.writeFileSync(filePath, content);
  }

  console.log('Keyzilla removal process completed:');
  console.log('Replaced k. occurrences with process.env.');
}

removeKeyzilla().then(() => {
  console.log('Keyzilla removal process completed');
}).catch((error) => {
  console.error('Error removing Keyzilla:', error);
});