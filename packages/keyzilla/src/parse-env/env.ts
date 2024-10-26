import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { ApiKey } from "../types/apikeys";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
 
// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// this function parses the environment variables
// it takes an array of api keys as an argument
// and returns an object with the environment variables
// it is used to generate the env.ts file
// the env.ts file is used to type the environment variables
// ? how about we bundle the env.ts file within the keyzilla dist file and then edit it with the api keys?
 
const parseEnv = (apiKeys: ApiKey[]) => {
  const isProd = process.env.NODE_ENV === 'production';
  const envConfig = {
    client: Object.fromEntries(
      apiKeys
        .filter(key => !key.isServer)
        .map(key => {
          const publicKey = key.name.startsWith('NEXT_PUBLIC_') ? key.name : `NEXT_PUBLIC_${key.name}`;
          return [publicKey, z.string().min(1)];
        })
    ) as Record<`NEXT_PUBLIC_${string}`, z.ZodType>,
    server: Object.fromEntries(
      apiKeys
        .filter(key => key.isServer)
        .map(key => [key.name, z.string().min(1)])
    ),
    runtimeEnv: Object.fromEntries(
      apiKeys.map(key => {
        const envKey = key.isServer ? key.name : (key.name.startsWith('NEXT_PUBLIC_') ? key.name : `NEXT_PUBLIC_${key.name}`);
        return [envKey, process.env[envKey] || key.apiKey]; // Now includes .env.local variables
      })
    ),
  };

  // Ensure .env.local exists and write environment variables to it
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  try {
    if (!fs.existsSync(envLocalPath)) {
      fs.writeFileSync(envLocalPath, ''); // Create the file if it does not exist
      console.log('.env.local file created');
    }
    // Prepare content to write to .env.local
    const envLocalContent = apiKeys.map(key => {
      const envKey = key.isServer ? key.name : (key.name.startsWith('NEXT_PUBLIC_') ? key.name : `NEXT_PUBLIC_${key.name}`);
      const envValue = process.env[envKey] || key.apiKey;
      return `${envKey}=${envValue}`;
    }).join('\n');
    fs.appendFileSync(envLocalPath, envLocalContent + '\n'); // Append new environment variables
    console.log('Environment variables written to .env.local');
  } catch (error) {
    console.error('Error handling .env.local file:', error);
  }

  // Ensure .env.local is in .gitignore
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  try {
    let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('.env.local')) {
      gitignoreContent += '\n.env.local\n';
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('.env.local added to .gitignore');
    }
  } catch (error) {
    console.error('Error updating .gitignore:', error);
  }

  // Generate the content for env.ts
  const envFileContent = `
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isProd = process.env.NODE_ENV === 'production';

const k = createEnv({
  client: {
${Object.entries(envConfig.client)
  .map(([key]) => `    ${JSON.stringify(key)}: z.string().min(1),`)
  .join('\n')}
  },
  server: {
${Object.entries(envConfig.server)
  .map(([key]) => `    ${JSON.stringify(key)}: z.string().min(1),`)
  .join('\n')}
  },
  runtimeEnv: isProd
    ? {
${apiKeys.map(key => {
  const envKey = key.isServer ? key.name : (key.name.startsWith('NEXT_PUBLIC_') ? key.name : `NEXT_PUBLIC_${key.name}`);
  return `        ${envKey}: process.env.${envKey} ?? '',`;
}).join('\n')}
      }
    : ${JSON.stringify(envConfig.runtimeEnv, null, 2)},
});

export { k };
  `.trim();
  let packagePath;
  try {
    packagePath = path.resolve(__dirname, '..', '..');
  } catch (error) {
    console.error('Error finding package path:', error);

    return null;
  }

  const distDir = path.join(packagePath, 'dist');
  const envFilePath = path.join(distDir, 'env.ts');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(envFilePath, envFileContent);
  console.log(`Environment configuration written successfully  to ${envFilePath}`);

  return envConfig;
};

export { parseEnv };

 