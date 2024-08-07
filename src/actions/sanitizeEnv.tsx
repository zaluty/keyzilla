"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText, streamObject } from "ai";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const { userId } = auth();
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google("models/gemini-1.5-flash-latest");

export async function sanitizeEnv(env: string) {
    console.log(env);
    try {
        const response = await generateObject({
            model,
            schema: z.object({
                envName: z.string(),
                envValue: z.string(),
            }),
            prompt: `Sanitize the following environment variables: ${env}`,
        });
        console.log(response);
        return response.object;

    } catch (error) {
        console.error("Error details:", error);

        throw new Error("Failed to sanitize environment variables");
    }
}