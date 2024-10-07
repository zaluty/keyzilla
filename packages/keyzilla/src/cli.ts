#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// this is the entry point for the cli we had to use this file because of some err encountered during the development
const command = process.argv[2];
// Function to resolve the path to a module within the keyzilla package
const basePath = path.resolve(__dirname, '../../../node_modules/keyzilla/dist');

switch (command) {
  case 'login':
    execSync(`node ${path.join(basePath, 'auth/index.js')}`, { stdio: 'inherit' });
    break;
  case 'logout':
      execSync(`node ${path.join(basePath, 'logout/index.js')}`, { stdio: 'inherit' });
    break;
  case 'pull':
    execSync(`node ${path.join(basePath, 'projects/main.js')}`, { stdio: 'inherit' });
    break;
  case 'remove':
    execSync(`node ${path.join(basePath, 'remove/main.js')}`, { stdio: 'inherit' });
    break;
  default:
    console.log(`Unknown command: ${command} \n\n here is a list of commands: \n\n login: to login to the keyzilla platform \n\n logout: to logout from the keyzilla platform \n\n pull: to pull the projects from the keyzilla platform \n\n remove: to remove the project from your codebase\n\n`);
    process.exit(1);
}
