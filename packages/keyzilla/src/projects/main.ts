#!/usr/bin/env node
import { authenticate } from "../auth";
import { fetchProjects, promptProjectType, promptProjectSelection, promptOrganizationSelection } from "./index"; // Ensure promptOrganizationSelection is implemented
import { handleCancellation } from "../helpers/cancel";
import { getErrorMessage } from "../helpers/getError";
import { Organization } from "../types/org";
import { spinner } from "@clack/prompts";
import { ApiKey } from "../types/apikeys";
import { parseEnv } from "../parse-env/env";
const { execSync } = require('child_process');
const path = require('path');
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * this is the main function 
 * it authenticates the user if not authenticated
 * prompts the user to select the project type with `promptProjectType`
 * prompts the user to select the organization with `promptOrganizationSelection`
 * fetches the projects with `fetchProjects`
 * prompts the user to select the project with `promptProjectSelection`
 * parses the api keys with `parseEnv`
 */
async function main() {
  try {
    const userData = await authenticate(process.env.NODE_ENV === 'production');
    if (!userData) {
      console.log("Authentication failed."); 
      return;
    }
   // we prompt the user to select the project type org | personal
    const projectType = await promptProjectType();
    let organizationId = null; // Initialize with null

    // if the user is part of multiple organizations and the project type is org we prompt the user to select the organization
    if (projectType === 'org' && userData.organizations.length > 1) {
      organizationId = await promptOrganizationSelection(userData.organizations);
    } else if (projectType === 'org') {
      // if the user is part of only one organization or the project type is not org we set the organization id to the first organization id
      organizationId = userData.organizations[0]?.id; // Default to first organization if only one exists
    }

    // we fetch the projects from the server
    const projects = await fetchProjects(projectType, userData.userId, organizationId as string);
    // if no projects are found we log an error and return
    if (projects.length === 0) {
      console.log("No projects found. Please create a project first: https://keyzilla.vercel.app/dashboard");
      return;
    }

    // we prompt the user to select the project
    const selectedProject = await promptProjectSelection(projects, userData.userId);
    // we log the selected project
    console.log(`You selected: ${selectedProject}`);
    const sp = spinner();
    sp.start("Parsing API keys...");
    // we flatten the api keys and map them to the desired format
    // this is done to make the api keys more readable and to make them easier to parse
    // the parsed api keys are used to create the env.ts file using the `parseEnv` function in the `parse-env` folder
    const apiKeys = projects.flatMap((project) => project.apiKeys.map(key => ({
      _id: key._id,
      apiKey: key.apiKey,
      isServer: key.isServer,
      name: key.name,
      projectId: key.projectId
    })));
    // we parse the api keys
    const parsedEnv = parseEnv(apiKeys);
    await sleep(2000);
    sp.stop("API keys parsed");
    // we find the project with the selected project name
    const projectWithKeys = projects.find((project) => project.name === selectedProject);
    // if no api keys are found for the selected project we log an error and return
    if (!projectWithKeys || !projectWithKeys.apiKeys) {
      console.error(`No API keys found for the selected project. Please add them here: https://keyzilla.vercel.app/name/${projectWithKeys?.name}?addApiKey=true`);
      return;
    }
  } catch (error) {
    // if there is an error we log it and handle the cancellation
    console.error("An error occurred:", getErrorMessage(error));
    handleCancellation();
  }
}
// we call the main function and catch any unexpected errors
// if there is an error we log it and exit the process
// this is done to ensure the process does not crash
main().catch((error) => {
  console.error("An unexpected error occurred:", getErrorMessage(error));
  process.exit(1);
});