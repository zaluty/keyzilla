import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
type Project = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status?: string;
    API?: string;
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const project: Project | null = await prisma.project.findUnique({
        where: {
            id: params.id,
        },
    });
    return (
        <div>
            <h1>Project Page {project?.name}</h1>
            <p>Project ID: {project?.id}</p>
            <p>Project Status: {project?.status}</p>
            <p>Project API: {project?.API}</p>


        </div>
    );
}