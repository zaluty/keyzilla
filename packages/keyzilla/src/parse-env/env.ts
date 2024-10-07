import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { ApiKey } from "../types/apikeys";
import fs from 'fs';
import path from 'path';

const parseEnv = (apiKeys: ApiKey[]) => {
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
        return [envKey, key.apiKey];
      })
    ),
  };

  // Generate the content for env.ts
  const envFileContent = `
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
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
  runtimeEnv: ${JSON.stringify(envConfig.runtimeEnv, null, 2)},
});

export const k = env;
  `.trim();
  
  let packagePath;
  try {
    packagePath = path.resolve(__dirname, '..', '..');
  } catch (error) {
    console.error('Error finding package path:', error);
    return envConfig;
  }

  const distDir = path.join(packagePath, 'dist');
  const envFilePath = path.join(distDir, 'env.ts');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(envFilePath, envFileContent);

  console.log(`Environment configuration written successfully  to ${envFilePath}`);

  // Return the created env object for immediate use
  return envConfig;
};

export { parseEnv };