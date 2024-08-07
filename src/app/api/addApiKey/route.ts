import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const { userId } = getAuth(request)
        const { name, key, repo } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const project = await prisma.project.findFirst({
            where: { name: repo }
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const apiKey = await prisma.apikey.create({
            data: {

                key,
                projectId: project.id
            }
        })

        return NextResponse.json(apiKey, { status: 201 })
    } catch (error) {
        console.error('Error adding API key:', error)
        return NextResponse.json({ error: 'Failed to add API key' }, { status: 500 })
    }
}