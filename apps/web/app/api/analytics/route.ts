import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api,  } from '../../../convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { clerkClient } from '@clerk/nextjs/server';
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) { 
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId') || "";
    if (!projectId) {
        return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    const projectName = searchParams.get('projectName') || "";
    const userId = searchParams.get('userId') || "";
    const user = await clerkClient().users.getUser(userId);
    const analytics = await convex.mutation(api.analytics.recordAnalytics, 
        {
            projectId: projectId as Id<"projects">,
            userId: userId,
            userName: user.firstName || "" + " " + user.lastName || "",
            projectName: projectName
            
        }
    );
    return NextResponse.json(analytics);
}