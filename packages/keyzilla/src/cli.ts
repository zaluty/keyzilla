#!/usr/bin/env node
import { Command } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import { Version } from './helpers/version';
const program = new Command();
const basePath: string = path.resolve(__dirname, '../../../node_modules/keyzilla/dist');

// Setup program metadata
program
  .name('keyzilla')
  .description('CLI tool for managing Keyzilla platform integration')
  .version('1.0.0'); // Replace with actual version

// Define commands with descriptions and actions
program
  .command('login')
  .description('Login to the Keyzilla platform')
  .action(() => {
    try {
      execSync(`node ${path.join(basePath, 'auth/index.js')}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to login:', error);
    }
  });

program
  .command('logout')
  .description('Logout from the Keyzilla platform')
  .action(() => {
    try {
      execSync(`node ${path.join(basePath, 'logout/index.js')}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  });

program
  .command('pull')
  .description('Pull projects from the Keyzilla platform')
  .action(() => {
    execSync(`node ${path.join(basePath, 'projects/main.js')}`, { stdio: 'inherit' });
  });

program
  .command('remove')
  .description('Remove project from your codebase')
  .action(() => {
    execSync(`node ${path.join(basePath, 'remove/index.js')}`, { stdio: 'inherit' });
  });

program
  .command('prod')
  .description('Use Keyzilla in production mode')
  .action(() => {
    execSync(`node ${path.join(basePath, 'production/index.js')}`, { stdio: 'inherit' });
  });

program
  .command('whoami')
  .description('Display current login credentials')
  .action(() => {
    execSync(`node ${path.join(basePath, 'whoami/index.js')}`, { stdio: 'inherit' });
  });

program
  .command('version')
  .description('Show Keyzilla version')
  .action(() => {
    Version();
  });

program.parse();  