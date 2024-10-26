import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseEnv } from '../src/parse-env/env';
import fs from 'fs';
import path from 'path';
import { ApiKey } from '../src/types/apikeys';
vi.mock('fs');
vi.mock('path');

describe('parseEnv', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(path, 'resolve').mockReturnValue('/mocked/path');
    vi.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate correct env configuration', () => {
    const apiKeys = [
      { name: 'API_KEY', apiKey: 'secret1', isServer: true },
      { name: 'PUBLIC_KEY', apiKey: 'public1', isServer: false },
      { name: 'NEXT_PUBLIC_KEY', apiKey: 'nextpublic1', isServer: false },
    ] as ApiKey[];

    const result = parseEnv(apiKeys);

    expect(result).toEqual({
      client: {
        'NEXT_PUBLIC_PUBLIC_KEY': expect.any(Object),
        'NEXT_PUBLIC_KEY': expect.any(Object),
      },
      server: {
        'API_KEY': expect.any(Object),
      },
      runtimeEnv: {
        'API_KEY': 'secret1',
        'NEXT_PUBLIC_PUBLIC_KEY': 'public1',
        'NEXT_PUBLIC_KEY': 'nextpublic1',
      },
    });
  });

  it('should create dist directory if it does not exist', () => {
    const apiKeys = [{ name: 'TEST_KEY', apiKey: 'test', isServer: true }];

    parseEnv(apiKeys as ApiKey[]);

    expect(fs.existsSync).toHaveBeenCalledWith('/mocked/path/dist');
    expect(fs.mkdirSync).toHaveBeenCalledWith('/mocked/path/dist', { recursive: true });
  });

  it('should write env.ts file with correct content', () => {
    const apiKeys = [
      { name: 'SERVER_KEY', apiKey: 'server_secret', isServer: true },
      { name: 'CLIENT_KEY', apiKey: 'client_public', isServer: false },
    ];

    parseEnv(apiKeys as ApiKey[]);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/mocked/path/dist/env.ts',
      expect.stringContaining('"NEXT_PUBLIC_CLIENT_KEY": z.string().min(1),')
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/mocked/path/dist/env.ts',
      expect.stringContaining('"SERVER_KEY": z.string().min(1),')
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/mocked/path/dist/env.ts',
      expect.stringContaining('"SERVER_KEY": "server_secret"')
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/mocked/path/dist/env.ts',
      expect.stringContaining('"NEXT_PUBLIC_CLIENT_KEY": "client_public"')
    );
  });

 
});