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
    content = content.replace(/k\./g, 'process.env.');
    fs.writeFileSync(filePath, content);
  }

  console.log('Keyzilla removal process completed:');
  console.log('Replaced all process.env.APIKEY_NAME occurrences with process.env.APIKEY_NAME');
}

removeKeyzilla().then(() => {
  console.log('Keyzilla removal process completed');
}).catch((error) => {
  console.error('Error removing Keyzilla:', error);
});
