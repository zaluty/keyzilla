import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import fetch from 'node-fetch';
import { text, password, isCancel, cancel, select } from '@clack/prompts';
import { UserData } from '../src/types/UserData';
import { ErrorResponse } from '../src/types/error';
import { authenticate } from '../src/auth';
import { fetchProjects } from '../src/projects';
import {
  checkAuthentication,
  saveAuthCache,
  clearAuthCache,
} from '../src/auth/lib/authCache';
import { handleCancellation } from '../src/helpers/cancel';
import { getProjectConfig, getProjectType, getProjectName, promptProjectType, promptProjectSelection } from '../src/projects';
import * as fs from 'fs';
import * as path from 'path';
import { Project } from '../src/types/project';
import * as dotenv from 'dotenv';
import { Response } from 'node-fetch';

vi.mock('node-fetch');
vi.mock('prompts');
vi.mock('@clack/prompts', async () => {
  const actual = (await vi.importActual('@clack/prompts')) as object;
  return {
    ...actual,
    text: vi.fn(),
    password: vi.fn(),
    isCancel: vi.fn(),
    cancel: vi.fn(),
    select: vi.fn(),
  };
});

const mockFetch = fetch as unknown as Mock;

// Update this line
const mockText = text as Mock;
const mockPassword = password as Mock;
const mockIsCancel = isCancel as unknown as Mock;
const mockCancel = vi.mocked(cancel);

vi.mock('../src/auth/lib/authCache', () => ({
  checkAuthentication: vi.fn(),
  saveAuthCache: vi.fn(),
  clearAuthCache: vi.fn(),
}));

const mockCheckAuthentication = checkAuthentication as Mock;
mockCheckAuthentication.mockResolvedValue(null);

// Add this mock for process.exit
const mockExit = vi
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);

vi.mock('fs');
vi.mock('path');

// Mock dotenv
vi.mock('dotenv', () => ({
  config: vi.fn(), 
}));

describe('authenticate', () => {
  beforeEach(() => {
    // Update the mocking implementation
    mockText.mockImplementation(() =>
      Promise.resolve('hamzaredone6@gmail.com')
    );
    mockPassword.mockImplementation(() =>
      Promise.resolve('skey_e9e5020c022be6cc4d2298fd1b1a51b2')
    );
    mockIsCancel.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should authenticate successfully with valid credentials', async () => {
    const mockUserData: UserData = {
      authenticated: true,
      userId: 'user_2lIMrqfvKXIV6zGC9jr1TY5TsAw',
      organizations: [
        {
          id: 'org_2lyjgH4GYRxFO5YmnBeN7ptlGZc',
          name: 'hamza',
          role: 'org:admin',
        },
      ],
      email: '',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    const result = await authenticate(false);
    console.log('Result:', result); // Add logging
    expect(result).toEqual(mockUserData);
    expect(saveAuthCache).toHaveBeenCalledWith(mockUserData);
  }, 10000); // Increase timeout to 10 seconds

  it('should fail authentication with invalid credentials', async () => {
    mockText.mockImplementation(() => Promise.resolve('invalid@example.com'));
    mockPassword.mockImplementation(() => Promise.resolve('wrongcode'));

    const mockErrorResponse: ErrorResponse = {
      error: 'Invalid credentials',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    const result = await authenticate(false);
    console.log('Result:', result); // Add logging
    expect(result).toBeNull();
    expect(clearAuthCache).toHaveBeenCalled();
  });

  it('should handle fetchUserId throwing an error', async () => {
    mockText.mockImplementation(() => Promise.resolve('invalid@example.com'));
    mockPassword.mockImplementation(() => Promise.resolve('wrongcode'));
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await authenticate(false);

    expect(result).toBeNull();
  });

  it('should handle verifyUser throwing an error', async () => {
    mockText.mockImplementation(() => Promise.resolve('invalid@example.com'));
    mockPassword.mockImplementation(() => Promise.resolve('wrongcode'));
    const mockUserData: UserData = {
      authenticated: true,
      userId: 'user_2lIMrqfvKXIV6zGC9jr1TY5TsAw',
      email: 'hamzaredone6@gmail.com',
      organizations: [
        {
          id: 'org_2lyjgH4GYRxFO5YmnBeN7ptlGZc',
          name: 'hamza',
          role: 'org:admin',
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    mockFetch.mockRejectedValueOnce(new Error('Verification error'));

    const result = await authenticate(false);
    console.log('Result:', result); // Add logging
    expect(result).toBeNull();
  });

  it('should handle email being undefined', async () => {
    mockText.mockImplementation(() => Promise.resolve(undefined));
    mockPassword.mockImplementation(() => Promise.resolve('hamza'));
    mockIsCancel.mockReturnValue(true);
    mockCancel.mockImplementation(() => {});

    const result = await authenticate(false);
    console.log('Result:', result);
    expect(result).toBeNull();
    expect(mockCancel).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should use cached authentication if available', async () => {
    const cachedUserData: UserData = {
      authenticated: true,
      userId: 'user_2lIMrqfvKXIV6zGC9jr1TY5TsAw ',
      organizations: [],
      email: 'hamzaredone6@gmail.com',
    };
    mockCheckAuthentication.mockResolvedValueOnce(cachedUserData);

    const result = await authenticate(false);
    expect(result).toEqual(cachedUserData);  
    expect(mockText).not.toHaveBeenCalled();
    expect(mockPassword).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe('fetchProjects', () => {
  it('should fetch projects successfully', async () => {
    const mockProjects = [
      {
        _creationTime: 1729103365772.4788,
        _id: "j975xv3fxgzbznfhhqc2vqbz8h72sx2v",
        allowedUsers: [
          "user_2lIMrqfvKXIV6zGC9jr1TY5TsAw",
          "user_2lIMrqfvKXIV6zGC9jr1TY5TsAw",
        ],
        apiKeys: [],
        createdAt: 1729103365772,
        description: "ddd",
        name: "keyzilla",
        updatedAt: 1729103365772,
        userId: "user_2lIMrqfvKXIV6zGC9jr1TY5TsAw",
        userName: "Hamza",
        userProfile: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18ybElNcnMzbElyS0JwM2RnS1g0bWltUEViN3gifQ",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockProjects),
    });

    const result = await fetchProjects(
      'org',
      'user_2lIMrqfvKXIV6zGC9jr1TY5TsAw'
    );
    expect(result).toEqual(mockProjects);
  });

  it('should use cached authentication for fetchProjects', async () => {
    const cachedUserData: UserData = {
      authenticated: true,
      
      userId: 'user_2lIMrqfvKXIV6zGC9jr1TY5TsAw',
      organizations: [],
      email: 'hamzaredone6@gmail.com',
    };
    mockCheckAuthentication.mockResolvedValueOnce(cachedUserData);

    const mockProjects = [
      {
        _creationTime: 1729103365772.4788,
        _id: "j975xv3fxgzbznfhhqc2vqbz8h72sx2v",
        allowedUsers: [
          "user_2lIMrqfvKXIV6zGC9jr1TY5TsAw",
          "user_2lIMrqfvKXIV6zGC9jr1TY5TsAw",
        ],
        apiKeys: [],
        createdAt: 1729103365772,
        description: "ddd",
        name: "keyzilla",
        updatedAt: 1729103365772,
        userId: "user_2lIMrqfvKXIV6zGC9jr1TY5TsAw",
        userName: "Hamza",
        userProfile: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18ybElNcnMzbElyS0JwM2RnS1g0bWltUEViN3gifQ",
      },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockProjects),
    });

    const result = await fetchProjects('personal', cachedUserData.userId);
    expect(result).toEqual(mockProjects);
    expect(mockText).not.toHaveBeenCalled();
    expect(mockPassword).not.toHaveBeenCalled();
  });
});

describe("Automatic project configuration in production", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NODE_ENV = "production";
    
    // Mock fs.existsSync to return true for the config file
    (fs.existsSync as Mock).mockImplementation((filePath: string) => {
      return filePath.endsWith('keyzilla.config.ts');
    });

    // Mock fs.readFileSync to return a mock config file content
    (fs.readFileSync as Mock).mockImplementation(() => `
      export const config = {
        projectName: "testProject",
        envType: "org"
      };
    `);

    // Mock path.resolve to return a fake path
    (path.resolve as Mock).mockReturnValue('/fake/path/keyzilla.config.ts');

    // Clear environment variables
    delete process.env.KEYZILLA_PROJECT_NAME;
    delete process.env.KEYZILLA_ENV_TYPE;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should get the project config automatically if the env is production", () => {
    const result = getProjectConfig();
    expect(result).toEqual({ projectName: 'testProject', envType: 'org' });
  });

  it("should get the project type automatically in production", () => {
    const result = getProjectType();
    expect(result).toBe('org');
  });

  it("should get the project name automatically in production", () => {
    const result = getProjectName();
    expect(result).toBe('testProject');
  });

  it("should return automatic project type without prompting in production", async () => {
    const result = await promptProjectType();
    expect(result).toBe('org');
    expect(select).not.toHaveBeenCalled();
  });

  it("should return automatic project name without prompting in production", async () => {
    const mockProjects = [
      { name: 'testProject' },
      { name: 'otherProject' }
    ];
    const result = await promptProjectSelection(mockProjects as unknown as Project[], 'user123');
    expect(result).toBe('testProject');
    expect(select).not.toHaveBeenCalled();
  });

  it("should throw an error if config file is not found", () => {
    (fs.existsSync as Mock).mockReturnValue(false);
    expect(() => getProjectConfig()).toThrow('keyzilla.config.ts file not found');
  });

  it("should throw an error if projectName is not defined in config", () => {
    (fs.readFileSync as Mock).mockReturnValue(`
      export const config = {
        envType: "org"
      };
    `);
    expect(() => getProjectConfig()).toThrow("projectName and envType must be defined in the keyzilla.config.ts file");
  });

  it("should throw an error if envType is not defined in config", () => {
    (fs.readFileSync as Mock).mockReturnValue(`
      export const config = {
        projectName: "testProject"
      };
    `);
    expect(() => getProjectConfig()).toThrow('envType must be defined in the keyzilla.config.ts file');
  });

  it("should throw an error if envType is not 'org' or 'personal'", () => {
    (fs.readFileSync as Mock).mockReturnValue(`
      export const config = {
        projectName: "testProject",
        envType: "invalid"
      };
    `);
    expect(() => getProjectConfig()).toThrow('envType must be either "org" or "personal"');
  });
});
 