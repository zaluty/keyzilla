"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { GitBranch, GitCommit } from 'lucide-react';

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const { user } = useUser();
    const [lastCommit, setLastCommit] = useState<string | null>(null);

    useEffect(() => {
        const fetchLastCommit = async () => {
            try {
                const response = await axios.get(`/api/github/lastcommit?repo=${project.name}`);
                setLastCommit(response.data.message);
            } catch (error) {
                console.error('Error fetching last commit:', error);
            }
        };

        fetchLastCommit();
    }, [project.name]);

    return (
        <div className="bg-white dark:bg-slate-400 p-6 rounded-lg shadow-md">
            <Link href={`/dashboard/project/${project.id}`}>
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            </Link>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <GitBranch className="mr-2 h-4 w-4" />
                <span>{user?.username || 'Unknown user'}</span>
            </div>
            {lastCommit && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <GitCommit className="mr-2 h-4 w-4" />
                    <span>{lastCommit}</span>
                </div>
            )}
        </div>
    );
}