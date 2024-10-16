 
 

export type KeyzillaConfig = {
  production: {
    projectName: string;
    envType: "org" | "personal";
  },
  /**
   * @description The credentials to use for the Keyzilla to use for authentication 
   * in production, you can set the credentials in the .env file
   * @example 
   * ```
   * credentials: {
   *   email: process.env.EMAIL,
   *   secretCode: process.env.SECRET_CODE
   * }
   * ``` 
   * 
   * ! do not commit the credentials to the repository
   */
  credentials: {
    email: string  
    secretCode: string  
  }
}

 
