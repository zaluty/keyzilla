import { Config } from "./src/config";

export const config = Config({
    credentials: {
        email: process.env.EMAIL!,
        secretCode: process.env.SECRET_CODE!
    },
    production: {
        projectName:  "keyzilla",
        envType:  "org"
    },

});
