#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
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
  // Step 2: Read and parse the env.ts file to get API keys and their values
  let apiKeys: Map<string, string>;
  try {
    const envContent = fs.readFileSync(keyzillaEnvPath, 'utf-8');
    const runtimeEnvMatch = envContent.match(/runtimeEnv\s*:\s*(isProd\s*\?\s*{[^}]*}\s*:\s*{[^}]*})/);

    if (!runtimeEnvMatch) {
      throw new Error('Unable to find runtimeEnv in env.ts');
    }

    apiKeys = new Map();

    const runtimeEnvContent = runtimeEnvMatch[1];
    const keyValuePairs = runtimeEnvContent.match(/"([^"]+)":\s*("([^"]+)"|'([^']+)'|([^,}]+))/g);

    if (!keyValuePairs) {
      throw new Error('No key-value pairs found in runtimeEnv');
    }

    keyValuePairs.forEach((pair) => {
      const matchResult = pair.match(/"([^"]+)":\s*("([^"]+)"|'([^']+)'|([^,}]+))/);
      if (!matchResult) {
        throw new Error(`Invalid format or no match found for pair: ${pair}`);
      }
      const [fullMatch, key, doubleQuotedValue, singleQuotedValue, unquotedValue] = matchResult;
      const value = doubleQuotedValue || singleQuotedValue || unquotedValue;
      if (!value) {
        throw new Error(`Value for key ${key} is undefined or not properly quoted`);
      }
      const cleanValue = value.replace(/process\.env\.[^\s]+\s*\?\?\s*/, '').replace(/^['"]|['"]$/g, '');
      apiKeys.set(key, cleanValue);
    });

    if (apiKeys.size === 0) {
      throw new Error('No API keys found in env.ts');
    }
  } catch (error) {
    console.error('Error parsing env.ts:', error);
    return;
  }

  // New step: Read existing .env file
  let existingEnvContent: { [key: string]: string } = {};
  if (fs.existsSync(envFilePath)) {
    const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
    envFileContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        existingEnvContent[key.trim()] = value.trim();
      }
    });
  }

  // Step 3: Find all TypeScript and JavaScript files
  const files = await glob('**/*.{ts,js,tsx,jsx}', {
    ignore: ['**/node_modules/**', '**/dist/**'],
  });

  // Step 4: Replace k.APIKEY_NAME with process.env.APIKEY_NAME
  for (const file of files) {
    const filePath = path.join(projectRoot, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    for (const [apiKey] of apiKeys) {
      const regex = new RegExp(`k\\.${apiKey}`, 'g');
      content = content.replace(regex, `process.env.${apiKey}`);
    }

    fs.writeFileSync(filePath, content);
  }

  // Step 5: Create .env file with API keys and their values
  const envContent = Array.from(apiKeys)
    .map(([key, value]) => {
      // Ensure the full value is captured and written, handling URLs or simple strings
      let fullValue = existingEnvContent[key] ?? value;
      return `${key}=${fullValue}`;
    })
    .join('\n');
  fs.writeFileSync(envFilePath, envContent);

  // Step 6: Add .env to .gitignore if not already present
  let gitignoreContent = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf-8')
    : '';
  if (!gitignoreContent.includes('.env')) {
    gitignoreContent += '\n.env\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
  }

  console.log('Keyzilla removal process completed:');
  console.log(
    '1. Replaced all k.APIKEY_NAME occurrences with process.env.APIKEY_NAME'
  );
  console.log('2. Created .env file with API keys and their values');
  console.log('3. Added .env to .gitignore (if not already present)');

  // Log the first 3 API keys
  const firstThreeKeys = Array.from(apiKeys.keys()).slice(0, 3);
  console.log('replaced keys:');
  firstThreeKeys.forEach((key, index) => {
    console.log(`${index + 1}. ${key}`);
  });
}

removeKeyzilla()
  .then(() => {
    console.log('Keyzilla removal process completed');
  })
  .catch((error) => {
    console.error('Error removing Keyzilla:', error);
  });
