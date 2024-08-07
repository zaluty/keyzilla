import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
    try {
        const { userId } = getAuth(request);
        const { name } = await request.json();
        console.log(userId, name);
        const project = await prisma.project.create({
            data: {
                name,

                userId: userId!,
            },
        });
        revalidatePath('/dashboard');
        return NextResponse.json(project, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}