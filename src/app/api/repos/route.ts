import { getAccessToken } from "@/lib/getAccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const accessToken = await getAccessToken(req);
        const response = await fetch('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const repos = await response.json();
        return NextResponse.json(repos);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
    }
}