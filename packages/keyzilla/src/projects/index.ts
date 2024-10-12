import { select, isCancel } from "@clack/prompts";
import { BASE_URL } from "../constants/urls";
import { Project } from "../types/project";
import { handleCancellation } from "../helpers/cancel";
import { getErrorMessage } from "../helpers/getError";
import { Organization } from "../types/org";

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
 * this function prompts the user to select the project type
 * it returns the project type org | personal
 */
export async function promptProjectType(): Promise<"org" | "personal"> {
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

  return selectedProject  as string;
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
