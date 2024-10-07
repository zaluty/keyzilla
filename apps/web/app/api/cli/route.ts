import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

 
export async function GET(req: NextRequest) {
    
 
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
  
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Find user by email
        const users = await clerkClient().users.getUserList({ emailAddress: [email] });
        
        if (!users.data || users.data.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = users.data[0];
        
        if (!user || !user.id) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 500 });
        }

        const organizations = await clerkClient().users.getOrganizationMembershipList({ userId: user.id });


        const orgData = organizations.data && organizations.data.length > 0
            ? organizations.data.map((org: { organization: { id: string; name: string }; role: string }) => ({
                id: org.organization.id,
                name: org.organization.name,
                role: org.role
            }))
            : [];
       console.log(orgData);
        return NextResponse.json({
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress || null,
            organizations: orgData
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "An error occurred while fetching user data" }, { status: 500 });
    }
}
