import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const project = await prisma.project.findUnique({
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