"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { encrypt } from "@/lib/encryption";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Info, Loader2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { useOrganization } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  apiKey: z
    .string()
    .min(1, "API Key is required")
    .refine((value) => !/\s/.test(value), "API Key should not contain spaces")
    .refine((value) => !value.startsWith('NEXT_PUBLIC'), "API Key should not start with 'NEXT_PUBLIC'"), // Ensure API Key does not start with 'NEXT_PUBLIC'
  isServer: z.boolean(),
});

interface AddApiKeyProps {
  projectId: Id<"projects"> | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  isFromCommand?: boolean;
}

export function AddApiKey({
  projectId,
  isOpen,
  onOpenChange,
  children,
  isFromCommand,
}: AddApiKeyProps) {
  const [Loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<
    Id<"projects"> | undefined
  >(undefined);
  const [projectError, setProjectError] = useState<string | null>(null);
  const { organization } = useOrganization();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      apiKey: "",
      isServer: false,
    },
  });

  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const createApiKey = useMutation(api.apiKeys.createApiKey);

  const getProjects = useQuery(api.projects.getProjects, {
    organizationId: organization?.id || undefined,
    enabled: isFromCommand,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const finalProjectId = isFromCommand ? selectedProject : projectId;
      if (!finalProjectId) {
        setProjectError("Project ID is required");
        setLoading(false);
        return;
      }
      await createApiKey({
        projectId: finalProjectId,
        value: encrypt(
          values.apiKey,
          process.env.SOME_KEY as string
        ),
        isServer: values.isServer,
        name: values.name,
      });
      setLoading(false);
      toast({
        title: "Success",
        description: "API Key created successfully",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      setLoading(false);
      if (
        error instanceof Error &&
        error.message.includes(
          " An API key with this name already exists for this project"
        )
      ) {
        toast({
          title: "Error",
          description: "API Key with this name already exists for this project",
          variant: "destructive",
        });
      } else {
        console.log("Debug: Error creating API Key", error);
        toast({
          title: "Error",
          description: "Failed to create API Key",
          variant: "destructive",
        });
      }
    }
  }

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="API Key Name"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.toUpperCase().replace(/ /g, "_")
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter API Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isServer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Key</FormLabel>
              <FormControl>
                <div className="flex items-center justify-between space-x-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <SwitchTooltip />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isFromCommand && getProjects && (
          <FormItem>
            <FormLabel>Project</FormLabel>
            <FormControl>
              <SelectProject
                projects={getProjects}
                setSelectedProject={setSelectedProject}
              />
            </FormControl>
            {projectError && (
              <p className="text-red-500 text-sm">{projectError}</p>
            )}
          </FormItem>
        )}
        <Button type="submit">
          {Loading ? <Loader2 className="animate-spin" /> : "Create"}
        </Button>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add API Key</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{FormContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  );
}

function SwitchTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="w-4 h-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm  max-w-[200px]">
            Server API Keys are accessible only on server-side if not set it
            will used as a client-side key
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SelectProject({
  projects,
  setSelectedProject,
}: {
  projects: Doc<"projects">[];
  setSelectedProject: React.Dispatch<
    React.SetStateAction<Id<"projects"> | undefined>
  >;
}) {
  return (
    <Select
      onValueChange={(value) => setSelectedProject(value as Id<"projects">)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project._id} value={project._id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
