"use client"
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Project } from '@/app/dashboard/page';

interface ProjectSearchProps {
    projects: Project[];
    onSearch: (filteredProjects: Project[]) => void;
}

export function ProjectSearch({ projects, onSearch }: ProjectSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const filteredProjects = projects.filter((project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        onSearch(filteredProjects);
    }, [searchTerm, projects, onSearch]);

    return (
        <div className=" w-full mr-4">
            <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
            />
        </div>
    );
}