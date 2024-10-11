"use client";
import Link from "next/link";
import { k } from "keyzilla";
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
import { formatDistanceToNow } from "date-fns";
import { Code, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
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
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ProjectGridProps {
  projects: Doc<"projects">[] | undefined;
  searchTerm: string;
}
export default function ProjectGrid({
  projects,
  searchTerm,
}: ProjectGridProps) {
  const filteredProjects = projects?.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 p-4">
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

  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });
    }
  }

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
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      className="relative w-full rounded-2xl border dark:border-zinc-900 hover:cursor-pointer overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
        style={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 80%)`,
          opacity: isHovered ? 1 : 0,
          pointerEvents: "none",
        }}
      />
      <div className="relative z-10 p-3">
        <div className="relative w-full aspect-[16/9] rounded overflow-hidden">
          <Image
            src={project.userProfile as string}
            alt={`${project.name} thumbnail`}
            fill
            loading="lazy"
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center justify-between flex-wrap">
            <Link href={`/dashboard/${project.name}`}>
              <h2 className="text-lg sm:text-xl font-semibold hover:underline">
                {project.name}
              </h2>
            </Link>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 mt-2 sm:mt-0">
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
          <p className="text-xs text-muted-foreground mt-2">
            {actionText}{" "}
            {formatDistanceToNow(new Date(dateToShow), { addSuffix: true })}
          </p>
        </div>
      </div>
    </motion.div>
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
