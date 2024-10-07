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


async function main() {
  try {
    const userData = await authenticate();
    if (!userData) {
      console.log("Authentication failed."); 
      return;
    }

    const projectType = await promptProjectType();
    let organizationId = null; // Initialize with null

    // Check if user is part of multiple organizations and selected 'Organization' type
    if (projectType === 'org' && userData.organizations.length > 1) {
      organizationId = await promptOrganizationSelection(userData.organizations);
    } else if (projectType === 'org') {
      organizationId = userData.organizations[0]?.id; // Default to first organization if only one exists
    }

    const projects = await fetchProjects(projectType, userData.userId, organizationId as string);

    if (projects.length === 0) {
      console.log("No projects found.");
      return;
    }

    const selectedProject = await promptProjectSelection(projects, userData.userId);
    console.log(`You selected: ${selectedProject}`);
    const sp = spinner();
    sp.start("Parsing API keys...");
    const apiKeys = projects.flatMap((project) => project.apiKeys.map(key => ({
      _id: key._id,
      apiKey: key.apiKey,
      isServer: key.isServer,
      name: key.name,
      projectId: key.projectId
    })));
    const envs = parseEnv(apiKeys);
    await sleep(2000);
    sp.stop("API keys parsed");
    const projectWithKeys = projects.find((project) => project.name === selectedProject);
    if (!projectWithKeys || !projectWithKeys.apiKeys) {
      console.error(`No API keys found for the selected project. Please add them here: https://keyzilla.vercel.app/name/${projectWithKeys?.name}?addApiKey=true`);
      return;
    }
  } catch (error) {
    console.error("An error occurred:", getErrorMessage(error));
    handleCancellation();
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred:", getErrorMessage(error));
  process.exit(1);
});