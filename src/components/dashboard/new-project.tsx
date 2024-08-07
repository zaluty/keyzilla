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
}

export function AddProjectDialog({ onAddProject }: AddProjectDialogProps) {
    const [projectName, setProjectName] = useState("")
    const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

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
            setOpen(false) // Close the dialog after successful submission
            setProjectName("") // Reset the project name
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
                <Button variant="outline">Add Project</Button>
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