import { ApiKey } from "./apikeys";
export interface Project {
  _creationTime: number;
  _id: string;
  allowedUsers: string[];
  apiKeys: ApiKey[];
  createdAt: number;
  description: string;
  name: string;
  organizationId: string;
  updatedAt: number;
  userId: string;
  userName: string;
  userProfile: string;
}