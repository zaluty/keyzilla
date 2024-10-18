import { KeyzillaConfig } from "./src/config";

export const config = KeyzillaConfig({
    credentials: {
        email: process.env.EMAIL! || "hamzaredone6@gmail.com",
        secretCode: process.env.SECRET_CODE! || "skey_e9e5020c022be6cc4d2298fd1b1a51b2"
    },
    production: {
        projectName:  "keyzilla",
        envType:  "org"
    },
 
});

 
