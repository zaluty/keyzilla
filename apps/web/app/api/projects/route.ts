import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
 

export async function GET(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  
 
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const organizationId = searchParams.get('orgId') || "";

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try { 
    const projects = await convex.query(api.cli.getCliProjects, { 
      userId, 
      organizationId: organizationId || undefined
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
