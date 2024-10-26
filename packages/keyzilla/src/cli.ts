#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
// This is the entry point for the cli 
// ? why is this needed when we  can use the npm bin in the package.json?
// ? we had to use this file because of some err encountered during the development
// ? the err was related to the `clack` package and the way it was being executed
const command = process.argv[2];
// Function to resolve the path to a module within the keyzilla package 
// ? why is this needed?
// ? we are using the `__dirname` to resolve the path to the dist folder
// ? this is done to ensure that the path is correct no matter where the user is running the command from
const basePath: string = path.resolve(__dirname, '../../../node_modules/keyzilla/dist');
// we switch the command and execute the corresponding file 
// ? why is this done this way?
// ? we are using the `execSync` to execute the command 
// ? this is done to ensure that the command is executed in the same process

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
    execSync(`node ${path.join(basePath, 'remove/index.js')}`, { stdio: 'inherit' });
    break;
  case 'prod':
    execSync(`node ${path.join(basePath, 'production/index.js')}`, { stdio: 'inherit' });
    break;
  case 'whoami':
    execSync(`node ${path.join(basePath, 'whoami/index.js')}`, { stdio: 'inherit' });
    break;
  case 'version':
    execSync(`node ${path.join(basePath, 'version/index.js')}`, { stdio: 'inherit' });
    break;
 
  default:
    console.log(`Unknown command: ${command} \n\n here is a list of commands: \n\n login: to login to the keyzilla platform \n\n logout: to logout from the keyzilla platform \n\n pull: to pull the projects from the keyzilla platform \n\n remove: to remove the project from your codebase\n\n prod: to use the keyzilla in production mode\n\n`);
    process.exit(1);
}
 