import Link from "next/link";
import { Protect, useOrganization, useUser, useAuth } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import AddProjectForm from "./add-project-form";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { Code, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProjectGridProps {
  projects: Doc<"projects">[] | undefined;
  searchTerm: string;
}
export default function ProjectGrid({
  projects,
  searchTerm,
}: ProjectGridProps) {
  const { user } = useUser();
  const filteredProjects = projects?.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 p-4">
      <ErrorBoundary errorComponent={() => <>Error</>}>
        {filteredProjects?.map((project: Doc<"projects">) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </ErrorBoundary>
    </div>
  );
}

interface ProjectCardProps {
  project: Doc<"projects">;
}
function ProjectCard({ project }: ProjectCardProps) {
  const { organization } = useOrganization();
  const { userId } = useAuth();
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isAddApiKeyDialogOpen, setIsAddApiKeyDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (
      searchParams.get("addApiKey") === "true" &&
      project.name === searchParams.get("project")
    ) {
      setIsAddApiKeyDialogOpen(true);
    }
  }, [searchParams, project.name]);

  if (!project) {
    return (
      <Protect
        condition={(has) =>
          !has({ permission: "org:sys_memberships:read" }) || !organization
        }
        fallback={<></>}
      >
        <div className="flex items-center justify-center gap-4">
          <PopoverDemo />
          <AddProjectForm
            isOpen={isAddProjectDialogOpen}
            onClose={() => setIsAddProjectDialogOpen(false)}
          />
        </div>
      </Protect>
    );
  }

  const isUpdated = project.createdAt !== project.updatedAt;
  const dateToShow = isUpdated ? project.updatedAt : project.createdAt;
  const actionText = isUpdated ? "Updated" : "Created";

  return (
    <div
      className={cn(
        "bg-white dark:bg-black p-6 rounded-lg shadow-md",
        "hover:border-2 hover:border-purple-500 dark:text-white",
        "hover:shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300",
        "flex flex-col justify-between h-full"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AvatarImage src={project.userProfile as string} />
                  </TooltipTrigger>
                  <TooltipContent>{project.userName}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AvatarFallback>
                {project.userProfile?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link href={`/dashboard/${project.name}`}>
              <h2 className="text-xl font-semibold hover:underline">
                {project.name}
              </h2>
            </Link>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600">
            {organization ? (
              <Protect
                role="org:admin"
                fallback={<ApiKeyCount count={project.apiKeys.length} />}
              >
                <AddApiKey projectName={project.name} />
              </Protect>
            ) : (
              <AddApiKey projectName={project.name} />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </div>
      <div className="text-xs text-muted-foreground mt-4">
        {actionText}{" "}
        {formatDistanceToNow(new Date(dateToShow), { addSuffix: true })}
      </div>
    </div>
  );
}

type AddApiKeyProps = {
  projectName: string;
  projectId?: Id<"projects">;
};

// Update the AddApiKey component
function AddApiKey({ projectName, projectId }: AddApiKeyProps) {
  const router = useRouter();
  const deleteProject = useMutation(api.projects.deleteProjectById);
  const handleDeleteProject = async () => {
    await deleteProject({ id: projectId as Id<"projects"> });
    router.push("/dashboard");
  };
  return (
    <>
      <Button variant="outline" size="sm" asChild className="  sm:w-auto">
        <Link href={`/dashboard/${projectName}?addApiKey=true`}>
          <Code className="w-4 h-4 mr-2" />
          Add API Key
        </Link>
      </Button>
    </>
  );
}

function ApiKeyCount({ count }: { count: number }) {
  return (
    <>
      <Code className="w-4 h-4" />
      <span>{count}</span>
    </>
  );
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex justify-around">
          <Button variant="outline">Button 1</Button>
          <Button variant="outline">Button 2</Button>
          <Button variant="outline">Button 3</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
