"use client"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AddProjectDialog } from '@/components/dashboard/new-project';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProjectDetails from '@/components/dashboard/projectDetails';
import { ProjectSearch } from '@/components/dashboard/Projects-Search';
import { Project as DialogProject } from '@/components/dashboard/new-project';
import { ProjectProvider } from '@/hooks/projextContext';
import NoProjectScreen from '@/components/dashboard/no-project-screen';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner';
import ErrorComponent from '@/components/dashboard/error';

type Project = DialogProject & {
    userId: string;
    createdAt: string;
}

export type { Project };

function Loading({ isLoading, count = 6 }: { isLoading: boolean; count?: number }) {
    if (!isLoading) return null;

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-md">
                    <Skeleton className="w-[100px] h-[20px] rounded-full mb-4" />
                    <Skeleton className="w-full h-[20px] rounded-full" />
                </div>
            ))}
        </>
    );
}

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false)
    const [username, setUsername] = useState<string | null>(null);
    const [errorr, seterror] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        console.log('Fetching projects');
        setIsLoading(true);
        try {
            const response = await axios.get('/api/projects');
            console.log('Fetched projects:', response.data);
            const sortedProjects = response.data.sort((a: Project, b: Project) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setProjects(sortedProjects);
            setFilteredProjects(sortedProjects);
        } catch (error) {
            setError(true)
            console.error('Error fetching projects:', error);
        } finally {

            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('Dashboard useEffect running');
        fetchProjects();
        fetchUsername(); // Move this inside the useEffect
    }, [fetchProjects]);

    const handleAddProject = useCallback(async (project: DialogProject) => {
        console.log('Adding project:', project);
        if (isLoading) return;

        try {
            const response = await axios.post('/api/create', project);
            console.log('Project added:', response.data);
            setProjects(prevProjects => {
                console.log('Updating projects state');
                toast.success('Project added successfully');
                return [response.data, ...prevProjects];
            });
            setFilteredProjects(prevFilteredProjects => [response.data, ...prevFilteredProjects]);
        } catch (error) {
            setError(true)
            console.error('Error adding project:', error);
        }
    }, [isLoading]);

    const handleSearch = useCallback((searchedProjects: Project[]) => {
        console.log('Search results:', searchedProjects);
        setFilteredProjects(searchedProjects);
    }, []);

    const contextValue = {
        handleAddProject,
    };

    const gridColumns = {
        sm: 1,
        md: 2,
        lg: 3
    };

    const skeletonCount = Math.max(...Object.values(gridColumns)) * 2;


    const fetchUsername = async () => {
        try {


            const response = await axios.get('/api/userMetadata');
            setUsername(response.data.username);

        } catch (error) {
            seterror('Failed to fetch GitHub username');
            console.error('Error fetching GitHub username:', error);
        }
    };

    fetchUsername();


    return (

        <ProjectProvider value={contextValue}>
            <h1 className="text-3xl font-bold mb-8">Your projects</h1>
            <div className="flex justify-between items-center mb-6">
                <ProjectSearch projects={projects} onSearch={handleSearch} disabled={isLoading} />
                <AddProjectDialog onAddProject={handleAddProject} disabled={isLoading} />
            </div>
            {isLoading && projects.length === 0 ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8`}>
                    <Loading isLoading={true} count={skeletonCount} />
                </div>

            ) : projects.length === 0 && !isLoading && !error ? (
                <NoProjectScreen />
            ) : (
                <>

                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 `}>
                        {!isLoading && filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white dark:bg-black hover:border-2 hover:border-purple-500 dark:text-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300">
                                <Link href={`/dashboard/${project.name}`}>

                                    <h2 className="text-xl font-semibold hover:underline">{project.name}</h2>

                                </Link>
                                <div className="flex items-center justify-between mt-2">
                                    <Badge className='text-[14px]'>{username}/{project.name}</Badge>

                                    <ProjectDetails />
                                </div>

                            </div>
                        ))}


                    </div>
                </>
            )

            }

        </ProjectProvider>
    );
}