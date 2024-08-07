import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function getAccessToken(req: NextRequest) {
    const { userId } = getAuth(req);

    const provider = "oauth_github";
    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
        userId!,
        provider
    ) as { data: { token: string }[] };

    const accessToken = clerkResponse.data[0].token;
    console.log(accessToken);
    return accessToken;
}