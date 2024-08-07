import 'server-only';
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function getAccessToken(req: NextRequest) {
    const { userId } = getAuth(req);

    if (!userId) {
        console.error('User ID is not available');
        return null;
    }

    const provider = "oauth_github";
    try {
        const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
            userId,
            provider
        ) as { data: { token: string }[] };

        if (!clerkResponse || !clerkResponse.data || !clerkResponse.data[0] || !clerkResponse.data[0].token) {
            console.error('Invalid response from Clerk:', clerkResponse);
            return null;
        }

        const accessToken = clerkResponse.data[0].token;
        console.log('Access Token:', accessToken);

        if (typeof accessToken !== 'string' || !accessToken) {
            console.error('Access token is not a valid string:', accessToken);
            return null;
        }

        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}