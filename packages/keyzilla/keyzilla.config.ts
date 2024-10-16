import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";
import dotenv from "dotenv";
import { KeyzillaConfig } from "./src/config";
import path from 'path';

// Load the .env file from the correct location
dotenv.config({
    path: path.resolve('.env.local')
});

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

 
