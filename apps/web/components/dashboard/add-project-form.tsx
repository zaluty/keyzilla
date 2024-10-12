"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useOrganization } from "@clerk/nextjs";
import { ConvexError } from "convex/values";
import { useMediaQuery } from "@/hooks/use-media-query";
import RoleBasedAccessCard from "./Role-Based-Access";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(50, "Description must be less than 50 characters"),
  allowedUsers: z
    .array(z.string())
    .min(1, "At least one user must be selected"),
});

interface AddProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProjectForm({
  isOpen,
  onClose,
}: AddProjectFormProps) {
  const createProject = useMutation(api.projects.createProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization } = useOrganization();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      allowedUsers: [],
    },
  });

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        onClose(); // This will toggle the dialog
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const projectId = await createProject({
        name: data.name,
        description: data.description,
        organizationId: organization?.id || "",
        allowedUsers: data.allowedUsers,
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      if (error instanceof ConvexError) {
        setSubmitError(error.data || error.message);
        form.setFocus("name");
      } else if (error instanceof Error) {
        setSubmitError(error.message);
        form.setFocus("name");
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is your project name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your project description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allowedUsers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allowed Users</FormLabel>
              <FormControl>
                <RoleBasedAccessCard
                  currentAllowedUsers={field.value}
                  onUsersChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <p className="text-red-500">{submitError}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project by filling out the form below.
              </DialogDescription>
            </DialogHeader>
            {FormContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={onClose}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add New Project</DrawerTitle>
              <DrawerDescription>
                Create a new project by filling out the form below.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">{FormContent}</div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
