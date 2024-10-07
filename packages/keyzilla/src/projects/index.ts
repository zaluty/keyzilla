import { select, isCancel } from "@clack/prompts";
import { BASE_URL } from "../constants/urls";
import { Project } from "../types/project";
import { handleCancellation } from "../helpers/cancel";
import { getErrorMessage } from "../helpers/getError";
import { Organization } from "../types/org";
import { z } from 'zod';
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
 
export async function promptOrganizationSelection(organizations: Organization[]) {
  const choices = organizations.map(org => ({ title: org.name, value: org.id }));
  const organizationId = await select({
    message: "Select an organization:",
    options: choices.map(choice => ({ value: choice.value, label: choice.title }))
  });
  return organizationId;
}
