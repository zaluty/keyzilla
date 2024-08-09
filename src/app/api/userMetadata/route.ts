import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/getAccessToken";

export async function GET(req: NextRequest) {
    try {
        const accessToken = await getAccessToken(req);
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub user data');
        }

        const userData = await response.json();
        return NextResponse.json({ username: userData.login });
    } catch (error) {
        console.error('Error fetching GitHub username:', error);
        return NextResponse.json({ error: 'Failed to fetch GitHub username' }, { status: 500 });
    }
}