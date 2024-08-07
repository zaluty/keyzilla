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

type Project = DialogProject & {
    userId: string;
}

export type { Project };

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);



    const fetchProjects = useCallback(async () => {
        console.log('Fetching projects');
        setIsLoading(true);
        try {
            const response = await axios.get('/api/projects');
            console.log('Fetched projects:', response.data);
            setProjects(response.data);
            setFilteredProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('Dashboard useEffect running');
        fetchProjects();
    }, [fetchProjects]);

    const handleAddProject = useCallback(async (project: DialogProject) => {
        console.log('Adding project:', project);
        if (isLoading) return;

        try {
            const response = await axios.post('/api/create', project);
            console.log('Project added:', response.data);
            setProjects(prevProjects => {
                console.log('Updating projects state');
                return [response.data, ...prevProjects];
            });
            setFilteredProjects(prevFilteredProjects => [response.data, ...prevFilteredProjects]);
        } catch (error) {
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

    return (
        <ProjectProvider value={contextValue}>
            {isLoading ? (
                <p>Loading projects...</p>
            ) : projects.length === 0 ? (
                <NoProjectScreen />
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                    <div className="flex justify-between items-center mb-6">

                        <ProjectSearch projects={projects} onSearch={handleSearch} />
                        <AddProjectDialog onAddProject={handleAddProject} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {isLoading && <p>Loading projects...</p>}

                        {filteredProjects.length > 0 && !isLoading && (
                            filteredProjects.map((project) => (
                                <div key={project.id} className="bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold">{project.name}</h2>
                                    <p className="text-gray-500 mb-4"></p>
                                    <div className="flex justify-between items-center">
                                        <Link href={`/dashboard/project/${project.id}`}>
                                            <Button>View</Button>
                                        </Link>
                                        <ProjectDetails repo={project.name} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </ProjectProvider>
    );
}