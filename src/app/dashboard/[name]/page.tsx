import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Navbar from "@/components/dashboard/projectNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const prisma = new PrismaClient();

type Project = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status?: string;
    API?: string;
};

export async function generateMetadata({ params }: { params: { name: string } }) {
    const project = await prisma.project.findFirst({
        where: {
            name: params.name,
        },
    });

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `Project: ${project.name}`,
    };
}

export default async function ProjectPage({ params }: { params: { name: string } }) {
    const project: Project | null = await prisma.project.findFirst({
        where: {
            name: params.name,
        },
    });

    if (!project) {
        notFound();
    }

    return (
        <div>
            <ProjectDetails {...project} />

        </div>
    );
}

function ProjectDetails(project: Project) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex justify-around mb-4">
                    <TabsTrigger value="overview" className="text-lg font-semibold w-1/4">Overview</TabsTrigger>
                    <TabsTrigger value="usage" className="text-lg font-semibold w-1/4">Usage</TabsTrigger>
                    <TabsTrigger value="analytics" className="text-lg font-semibold w-1/4">Analytics</TabsTrigger>
                    <TabsTrigger value="people" className="text-lg font-semibold w-1/4">People</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4   rounded-lg">
                    <p className="text-base">Project Name: {project.name}</p>
                    <p className="text-base">Project ID: {project.id}</p>
                    <p className="text-base">Project Status: {project.status}</p>
                    <p className="text-base">Project API: {project.API}</p>
                </TabsContent>
                <TabsContent value="usage" className="p-4 bg- first-line:-100 rounded-lg">
                    <p className="text-base">Project API: {project.API}</p>
                </TabsContent>
                <TabsContent value="analytics" className="p-4  -gray-100 rounded-lg">
                    <p className="text-base">Project Status: {project.status}</p>
                </TabsContent>
                <TabsContent value="people" className="p-4 bg- -100 rounded-lg">
                    <p className="text-base">Project Status: {project.status}</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}