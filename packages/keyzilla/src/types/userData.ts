import { Organization } from "./org";

export type UserData =  {
    userId: string;
    email: string | null;
    organizations: Organization[];
    authenticated: boolean;
  } 