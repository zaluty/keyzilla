import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

 

 
export async function POST(request: NextRequest) {
  

  const body = await request.json();
  const { secretKey, userId } = body;
  console.log(secretKey, userId);
  if (!secretKey || !userId) {
    return NextResponse.json({ error: 'Missing required fields: secretKey and userId' }, { status: 400 });
  }

  try {
    const isAuthenticated = await convex.query(api.cli.verify, { secretKey, userId });

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Error checking user access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
