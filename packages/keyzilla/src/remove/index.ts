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
    console.log(keyzillaEnvPath)
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
    const clientMatch = envContent.match(/client:\s*{([^}]+)}/);
    const serverMatch = envContent.match(/server:\s*{([^}]+)}/);
    const runtimeEnvMatch = envContent.match(/runtimeEnv:\s*{([^}]+)}/);
    
    if (!clientMatch && !serverMatch) {
      throw new Error('Unable to find API keys in env.ts');
    }

    apiKeys = new Map();
    
    const parseSection = (section: string) => {
      const keyValuePairs = section.match(/"([^"]+)":\s*([^,\n]+)/g);
      keyValuePairs?.forEach(pair => {
        const [key, value] = pair.split(':').map(part => part.trim().replace(/['"]/g, ''));
        apiKeys.set(key, value);
      });
    };

    if (clientMatch) parseSection(clientMatch[1]);
    if (serverMatch) parseSection(serverMatch[1]);
    
    // Parse runtimeEnv to get actual values
    if (runtimeEnvMatch) {
      const runtimeEnvPairs = runtimeEnvMatch[1].match(/"([^"]+)":\s*([^,\n]+)/g);
      runtimeEnvPairs?.forEach(pair => {
        const [key, value] = pair.split(':').map(part => part.trim().replace(/['"]/g, ''));
        if (apiKeys.has(key)) {
          apiKeys.set(key, value);
        }
      });
    }

    if (apiKeys.size === 0) {
      throw new Error('No API keys found in env.ts');
    }
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
    
    for (const [apiKey] of apiKeys) {
      const regex = new RegExp(`k\\.${apiKey}`, 'g');
      content = content.replace(regex, `process.env.${apiKey}`);
    }

    fs.writeFileSync(filePath, content);
  }

  // Step 5: Create .env file with API keys and their values
  const envContent = Array.from(apiKeys)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  fs.writeFileSync(envFilePath, envContent);

  // Step 6: Add .env to .gitignore if not already present
  let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf-8') : '';
  if (!gitignoreContent.includes('.env')) {
    gitignoreContent += '\n.env\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
  }
  
  console.log('Keyzilla removal process completed:');
  console.log('1. Replaced all process.env.APIKEY_NAME occurrences with process.env.APIKEY_NAME');
  console.log('2. Created .env file with API keys and their values');
  console.log('3. Added .env to .gitignore (if not already present)');
}


removeKeyzilla().then(() => {
  console.log('Keyzilla removal process completed');
}).catch((error) => {
  console.error('Error removing Keyzilla:', error);
});
