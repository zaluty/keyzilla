import { useState, useEffect } from "react"
import { Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Project = {
    id: string;
    name: string;
    status: string;
    API: string;
}
type GitHubProject = {
    id: number;
    name: string;
}

export function AddProjectDialog({ onAddProject }: { onAddProject: (project: Project) => void }) {
    const [projectName, setProjectName] = useState("")
    const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchGithubProjects()
    }, [])

    const fetchGithubProjects = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/repos')
            const data = await response.json()
            setGithubProjects(data)
        } catch (error) {
            console.error('Error fetching GitHub projects:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddProject = async (closeDialog: () => void) => {
        const newProject: Project = {
            id: Date.now().toString(),
            name: projectName,
            status: "New",
            API: 'd'
        }
        try {
            const response = await fetch('/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: projectName }),
            });
            if (!response.ok) {
                throw new Error('Failed to create project');
            }
            const createdProject = await response.json();
            onAddProject(createdProject);
            setProjectName("");
            closeDialog();
        } catch (error) {
            console.error('Error creating project:', error);
            // Handle error (e.g., show error message to user)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="projectName" className="text-right">
                            Project Name
                        </Label>
                        <div className="col-span-3 relative">
                            <Input
                                id="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="pr-10"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full">
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className={cn(
                                        "max-h-[200px] overflow-y-auto",
                                        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
                                        "dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
                                    )}
                                >
                                    {githubProjects.map((project) => (
                                        <DropdownMenuItem key={project.id} onSelect={() => setProjectName(project.name)}>
                                            {project.name}
                                        </DropdownMenuItem>
                                    ))}

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={(e) => {
                            e.preventDefault()
                            handleAddProject(() => { })
                        }} disabled={!projectName}>
                            Add Project
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}