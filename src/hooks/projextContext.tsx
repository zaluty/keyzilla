import React, { createContext, useContext, ReactNode } from 'react';
import { Project } from '@/components/dashboard/new-project';

interface ProjectContextType {
    handleAddProject: (project: Project) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
};

export const ProjectProvider: React.FC<{ children: ReactNode; value: ProjectContextType }> = ({ children, value }) => {
    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};