import { select, isCancel } from "@clack/prompts";
import { BASE_URL } from "../constants/urls";
import { Project } from "../types/project";
import { handleCancellation } from "../helpers/cancel";
import { getErrorMessage } from "../helpers/getError";
import { Organization } from "../types/org";
import fs from 'fs';
import path from 'path';
// this function fetches the projects from the server
// it takes the project type, the user id and the organization id as arguments
// and returns an array of projects
// if the projects are not found, it returns an empty array
// if there is an error, it throws an error
export async function fetchProjects(
  projectType: "org" | "personal",
  userId: string,
  organizationId?: string
): Promise<Project[]> {
  const response = await fetch(
    `${BASE_URL}/api/projects?userId=${userId}${
      projectType === "org" && organizationId ? `&orgId=${organizationId}` : ""
    }`,
    {
      method: "GET",
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${responseText}`
    );
  }

  const projects = JSON.parse(responseText) as Project[];

   return projects;

}



/**
 * this is an internal function that is used to record analytics data
 * it takes the project id, the project name and the user id as arguments
 * does not return anything
 * so in the dashboard we can see which projects are being used the most by the teams you have 
 */
export async function returnProjectAnalytics({projectId, projectName, userId}: {projectId: string, projectName: string, userId: string}) {
  await fetch(`${BASE_URL}/api/analytics?projectId=${projectId}&projectName=${projectName}&userId=${userId}`, {
    method: "GET",
  })
}


/**
 * This function reads the project configuration from the keyzilla.config.ts file
 * @returns An object containing the project name and environment type
 */
export function getProjectConfig(): { projectName: string, envType: "org" | "personal" } {
  const configPath = path.resolve(process.cwd(), 'keyzilla.config.ts');

  if (!fs.existsSync(configPath)) {
    throw new Error('keyzilla.config.ts file not found in the project root');
  }

  const configContent = fs.readFileSync(configPath, 'utf8');

  // Extract projectName and envType using regex
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

/**
 * This function determines whether to use automatic configuration or prompt the user
 * @returns True if automatic configuration should be used, false otherwise
 */
function shouldUseAutomaticConfig(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * this function prompts the user to select the project type
 * it returns the project type org | personal
 */
export async function promptProjectType(): Promise<"org" | "personal"> {
  if (shouldUseAutomaticConfig()) {
    const { envType } = getProjectConfig();
    return envType;
  }

  const projectType = await select({
    message: "Select an environment?",
    options: [
      { value: "org", label: "Organization" },
      { value: "personal", label: "Personal" },
    ],
  });

  if (isCancel(projectType)) {
    handleCancellation();
  }

  return projectType as "org" | "personal";
}

/**
 * this function prompts the user to select the project
 * it takes the projects and the user id as arguments
 * and returns the project name
 *  @example
 *  const projects = await fetchProjects("org", "123", "456");
 *  const projectName = await promptProjectSelection(projects, "123");
 *  console.log(projectName);
*/
export async function promptProjectSelection(
  projects: Project[],
  userId: string
): Promise<string> {
  if (shouldUseAutomaticConfig()) {
    const { projectName } = getProjectConfig();
    return projectName;
  }

  const selectedProject = await select({
    message: "Select a project:",
    options: projects.map((project) => ({
      value: project.name,
      label: project.name,
    })),
  });

  if (isCancel(selectedProject)) {
    handleCancellation();
  }

  return selectedProject as string;
}

/**
 *  why is this needed?
 *  we already have the organization id in the user data the user might have multiple organizations
 *  without this function the project fetching will get the first `orgID` in the array
 *
 * this function prompts the user to select the organization
 * it takes the organizations as arguments
 * and returns the organization id
 */
export async function promptOrganizationSelection(organizations: Organization[]) {
  const choices = organizations.map(org => ({ title: org.name, value: org.id }));
  const organizationId = await select({
    message: "Select an organization:",
    options: choices.map(choice => ({ value: choice.value, label: choice.title }))
  });
  return organizationId;
}

/**
 * This function gets the project type automatically from the .env file
 * @returns The project type ("org" | "personal")
 */
export function getProjectType(): "org" | "personal" {
  const { envType } = getProjectConfig();
  return envType;
}

/**
 * This function gets the project name automatically from the .env file
 * @returns The project name
 */
export function getProjectName(): string {
  const { projectName } = getProjectConfig();
  return projectName;
}