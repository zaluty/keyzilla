// /api/user this route is used to get all the information about the array of userids in a project 
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { cp } from "fs";

export async function POST(request: NextRequest) {
  const identity = await auth();
  if (!identity) {
    return NextResponse.json({ error: "Not authenticated, authentication token is missing" }, { status: 401 });
  }
  
  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const userIds = body.userIds;
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: "User IDs are required and must be an array" }, { status: 400 });
  }

  try {
    const users = await clerkClient.users.getUserList({
      userId: userIds,
    });

    const userInfo = users.data.map((user) => ({
      id: user.id || null,
      name: `${user.firstName}` || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '',
      email: user.emailAddresses[0]?.emailAddress || '', // Add email to the returned data
    }));
    console.log(userInfo);
    return NextResponse.json({ users: userInfo });
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json({ error: "Failed to fetch user information" }, { status: 500 });
  }
}
