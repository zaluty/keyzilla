"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings(props: { project: Doc<"projects"> }) {
  const { project } = props;
  const deleteProjectById = useMutation(api.projects.deleteProjectById);
  const updateProject = useMutation(api.projects.updateProject);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(
    project.description
  );

  const isChanged =
    projectName.trim() !== project.name.trim() ||
    projectDescription.trim() !== project.description.trim();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProjectById({ id: project._id });
      router.push("/dashboard");
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      setIsDeleting(false);
      toast.error("Failed to delete project");
    }
  };

  const handleUpdate = async () => {
    if (!isChanged) return;
    try {
      await updateProject({
        id: project._id,
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>Manage your project settings here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description</Label>
            <Input
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end">
            <Button
              onClick={handleUpdate}
              disabled={
                !projectName.trim() ||
                !projectDescription.trim() ||
                isDeleting ||
                !isChanged
              }
            >
              Update Project
            </Button>
          </div>
        </div>

        <Separator />

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Danger Zone</AlertTitle>
          <AlertDescription>
            Deleting this project will permanently remove all associated data.
            <div className="mt-3 flex justify-end items-end">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
