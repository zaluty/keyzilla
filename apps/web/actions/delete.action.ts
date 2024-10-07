"use server";
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { redirect, RedirectType } from 'next/navigation';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function DELETE(userId: string) {
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' })
    }
    try {
        await clerkClient().users.deleteUser(userId);
        await convex.mutation(api.user.deleteUserData, { userId });
        redirect("/", RedirectType.replace);
        return NextResponse.json({ message: 'User and associated data deleted' });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error deleting user and associated data' })
    }
}