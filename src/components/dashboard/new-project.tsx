"use client"
import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Project = {
    id: string;
    name: string;
}

export type { Project }

type GitHubProject = {
    id: number;
    name: string;
}

interface AddProjectDialogProps {

    onAddProject: (project: Project) => void;
    disabled: boolean
}

export function AddProjectDialog({ onAddProject, disabled }: AddProjectDialogProps) {
    const [projectName, setProjectName] = useState("")
    const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([])
    const [loading, setLoading] = useState(false)
    const [existingProjects, setExistingProjects] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const existingProjectNames = await fetchExistingProjects()
            await fetchGithubProjects(existingProjectNames)
        }
        fetchData()
    }, [])

    const fetchExistingProjects = async () => {
        try {
            const response = await fetch('/api/projects')
            const data = await response.json()
            const projectNames = data.map((project: Project) => project.name)
            setExistingProjects(projectNames)
            return projectNames
        } catch (error) {
            console.error('Error fetching existing projects:', error)
            return []
        }
    }

    const fetchGithubProjects = async (existingProjectNames: string[]) => {
        setLoading(true)
        try {
            const response = await fetch('/api/repos')
            const data = await response.json()
            const filteredProjects = data.filter((project: GitHubProject) =>
                !existingProjectNames.includes(project.name)
            )
            setGithubProjects(filteredProjects)
        } catch (error) {
            console.error('Error fetching GitHub projects:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddProject = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isSubmitting) return
        setIsSubmitting(true)
        setLoading(true)
        try {
            await onAddProject({
                id: Date.now().toString(),
                name: projectName,
            })
            setOpen(false)
            setProjectName("")


            const existingProjectNames = await fetchExistingProjects()
            await fetchGithubProjects(existingProjectNames)
        } catch (error) {
            console.error('Error adding project:', error)
        } finally {
            setIsSubmitting(false)
            setLoading(false)
        }
    }, [projectName, onAddProject, isSubmitting])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={loading || disabled}>Add Project</Button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleAddProject}>
                    <DialogHeader>
                        <DialogTitle>Add New Project</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="projectName" className="text-right">
                                Project Name
                            </Label>
                            <div className="col-span-3 relative">
                                <Select onValueChange={(value) => setProjectName(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {githubProjects.map((project) => (
                                            <SelectItem key={project.id} value={project.name}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!projectName || isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}