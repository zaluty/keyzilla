export type UserData =  {
    userId: string;
    email: string | null;
    organizations: Array<{
      id: string;
      name: string;
      role: string; // admin, member, viewer
    }>;
    authenticated: boolean;
  }