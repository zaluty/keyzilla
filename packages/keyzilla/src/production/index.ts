#!/usr/bin/env node
import { authenticate } from "../auth";
import { fetchProjects } from "../projects";
import { parseEnv } from "../parse-env/env";
import { spinner } from "@clack/prompts";
import path from 'path';
import fs from 'fs';
import { UserData } from "../types/userData";
import { getErrorMessage } from "../helpers/getError";
import { Project } from "../types/project";
import { ApiKey } from "../types/apikeys";


process.env.NODE_ENV = 'production';

if (process.env.NODE_ENV !== 'production') {
  throw new Error('This script is only available in production');
}


interface ProjectConfig {
  projectName: string;
  envType: "org" | "personal";
}

function getProjectConfig(): ProjectConfig {

  const configPath = path.resolve(process.cwd(), 'keyzilla.config.ts');

  if (!fs.existsSync(configPath)) {
    throw new Error('keyzilla.config.ts file not found in the project root');
  }

  const configContent = fs.readFileSync(configPath, 'utf8');

  const projectNameMatch = configContent.match(/projectName:\s*["'](.+?)["']/);
  const envTypeMatch = configContent.match(/envType:\s*["'](.+?)["']/);

  if (!projectNameMatch || !envTypeMatch) {
    throw new Error('projectName and envType must be defined in the keyzilla.config.ts file');
  }

  const projectName = projectNameMatch[1];
  const envType = envTypeMatch[1] as "org" | "personal";

  if (envType !== "org" && envType !== "personal") {
    throw new Error('envType must be either "org" or "personal"');
  }

  return { projectName, envType };
}

async function main() {
  const sp = spinner();
  try {
    sp.start("Authenticating...");
    const userData: UserData | null = await authenticate(process.env.NODE_ENV === 'production');
    if (!userData) {
      sp.stop("Authentication failed.");
      return;
    }
    sp.stop("Authentication successful.");

    const { projectName, envType } = getProjectConfig();

    sp.start("Fetching projects...");
    const projects: Project[] = await fetchProjects(
      envType,
      userData.userId,
      envType === "org" ? userData.organizations[0]?.id : undefined
    );

    if (projects.length === 0) {
      sp.stop("No projects found.");
      console.log("Please create a project first: https://keyzilla.vercel.app/dashboard");
      return;
    }
    sp.stop("Projects fetched successfully.");

    const selectedProject = projects.find(project => project.name === projectName);

    if (!selectedProject) {
      console.error(`Project "${projectName}" not found. Please check your keyzilla.config.ts file.`);
      return;
    }

    console.log(`Selected project: ${selectedProject.name}`);

    sp.start("Parsing API keys...");
    const apiKeys: ApiKey[] = selectedProject.apiKeys.map(key => ({
      _id: key._id,
      apiKey: key.apiKey,
      isServer: key.isServer,
      name: key.name,
      projectId: key.projectId
    }));

    const parsedEnv = parseEnv(apiKeys);
    sp.stop("API keys parsed successfully.");

    console.log("API keys successfully pulled and parsed.");



  } catch (error) {
    sp.stop("An error occurred.");
    console.error("Error details:", getErrorMessage(error));
  }
}

// Add this condition to check if the file is being run directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Error details:", getErrorMessage(error));
    process.exit(1);
  });
}

export { main };