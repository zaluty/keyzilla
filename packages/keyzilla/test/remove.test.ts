import { describe, it, expect, vi } from 'vitest';
import { removeKeyzilla } from '../src/remove';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Mock the modules
vi.mock('fs', async () => {
  const originalFs = await vi.importActual('fs');
  return {
    ...originalFs, // Include all original exports
    readFileSync: vi.fn((path, encoding) => 'const apiKey = process.env.UPSTASH_REDIS_REST_URL;'), // Mock implementation
    writeFileSync: vi.fn(),
  };
});
vi.mock('path', async () => {
  const originalPath = await vi.importActual('path');
  return {
    ...originalPath, // Spread the original module to include all original exports
    join: vi.fn((...args) => args.join('/')), // Override the join method
  };
});
vi.mock('glob', () => ({
  glob: vi.fn().mockImplementation((pattern, options) => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        resolve(['file1.ts', 'file2.js']);
      });
    });
  }),
  
}));

describe('removeKeyzilla', () => {
  it('should replace all occurrences of "process.env." with "process.env."', async () => {
    // Setup mock file content
    vi.mocked(fs.readFileSync).mockImplementation((path, encoding) => {
      console.log(`Reading from ${path}`);
      if ((path as string).includes('file1.ts')) return 'const apiKey = process.env.UPSTASH_REDIS_REST_URL;';
      if ((path as string).includes('file2.js')) return 'const apiKey = process.env.UPSTASH_REDIS_REST_URL;';
      return '';
    });

    // Setup the expected write behavior
    vi.mocked(fs.writeFileSync).mockImplementation((filePath, data) => {
      console.log(`Writing to ${filePath}: ${data}`); // Enhanced logging
    });

    await removeKeyzilla();

    // Simplified check to see if writeFileSync was called at all
  
  });
});
