import { AddProjectDialog } from "./new-project";
import { useProjectContext } from '@/hooks/projextContext';

export default function NoProjectScreen() {
    const { handleAddProject } = useProjectContext();

    return <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">No projects found</h1>
        <p className="text-lg">Add a project to get started</p>
        <AddProjectDialog onAddProject={handleAddProject} disabled={false} />
    </div>
}