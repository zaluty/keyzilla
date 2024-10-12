#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export async function removeKeyzilla() {
  const projectRoot = process.cwd();
  const envFilePath = path.join(projectRoot, '.env');
  const gitignorePath = path.join(projectRoot, '.gitignore');
  
  // Step 1: Find the keyzilla package and env.ts file in the dist folder
  let keyzillaEnvPath: string | null = null;
  try {
    const nodeModulesPath = path.join(projectRoot, 'node_modules');
    const keyzillaPath = path.join(nodeModulesPath, 'keyzilla');
    const keyzillaDistPath = path.join(keyzillaPath, 'dist');
    keyzillaEnvPath = path.join(keyzillaDistPath, 'env.ts');
    
    if (!fs.existsSync(keyzillaEnvPath)) {
      throw new Error('env.ts not found in keyzilla package dist folder');
    }
  } catch (error) {
    console.error('Error finding keyzilla env.ts:', error);
    return;
  }

  // Step 2: Read and parse the env.ts file to get API keys
  let apiKeys: Set<string>;
  try {
    const envContent = fs.readFileSync(keyzillaEnvPath, 'utf-8');
    const keyMatch = envContent.match(/Object\.keys\((\w+)\)/);
    if (!keyMatch) {
      throw new Error('Unable to find API keys in env.ts');
    }
    const keysVarName = keyMatch[1];
    const keysMatch = envContent.match(new RegExp(`${keysVarName}\\s*=\\s*({[^}]+})`));
    if (!keysMatch) {
      throw new Error('Unable to parse API keys from env.ts');
    }
    // Replace eval with JSON.parse
    const keysObj = JSON.parse(keysMatch[1].replace(/'/g, '"'));
    apiKeys = new Set(Object.keys(keysObj));
  } catch (error) {
    console.error('Error parsing env.ts:', error);
    return;
  }

  // Step 3: Find all TypeScript and JavaScript files
  const files = await glob('**/*.{ts,js,tsx,jsx}', { ignore: ['**/node_modules/**', '**/dist/**'] });

  // Step 4: Replace k.APIKEY_NAME with process.env.APIKEY_NAME
  for (const file of files) {
    const filePath = path.join(projectRoot, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    for (const apiKey of apiKeys) {
      const regex = new RegExp(`k\\.${apiKey}`, 'g');
      content = content.replace(regex, `process.env.${apiKey}`);
    }

    fs.writeFileSync(filePath, content);
  }

  // Step 5: Create .env file with API keys
  const envContent = Array.from(apiKeys).map(key => `${key}=`).join('\n');
  fs.writeFileSync(envFilePath, envContent);

  // Step 6: Add .env to .gitignore if not already present
  let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf-8') : '';
  if (!gitignoreContent.includes('.env')) {
    gitignoreContent += '\n.env\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
  }
  
  console.log('Keyzilla removal process completed:');
  console.log('1. Replaced all process.env.APIKEY_NAME occurrences with process.env.APIKEY_NAME');
  console.log('2. Created .env file with empty API key values');
  console.log('3. Added .env to .gitignore (if not already present)');
}
