"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Sun,
  Moon,
  Plus,
  LogOut,
  Home,
  FolderPlus,
  Key,
  HelpCircle,
  Code,
  MessageCircle,
  Building2,
  User2Icon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Protect,
  SignOutButton,
  useAuth,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AddApiKey } from "./add-api-key";
import AddProjectForm from "./add-project-form";
import { useParams } from "next/navigation";
import Feedback from "../feedback";
import CreateOrganization from "./create-org";
import { InviteMember } from "./invite-user";
export function CommandDialogs() {
  const [open, setOpen] = React.useState(false);
  const [createOrg, setCreateOrg] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const [isInviteUsersDialogOpen, setIsInviteUsersDialogOpen] =
    React.useState(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] =
    React.useState(false);
  const [isAddApiKeyDialogOpen, setIsAddApiKeyDialogOpen] =
    React.useState(false);
  const createProject = useMutation(api.projects.createProject);
  const { organization } = useOrganization();
  const projects = useQuery(api.projects.getProjects, {
    organizationId: organization?.id || "",
  });
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setOpen(false);
  };

  const handleAddProject = async () => {
    setOpen(false);
    setIsAddProjectDialogOpen(true);
  };

  const handleAddApiKey = () => {
    setOpen(false);
    setIsAddApiKeyDialogOpen(true);
  };

  const handleFeedback = () => {
    setOpen(false);
    setIsFeedbackOpen(true);
  };
  const handleSignOut = () => {
    signOut();
    router.push("/");
  };
  const handleCreateOrg = () => {
    setOpen(false);
    setCreateOrg(true);
  };
  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                router.push("/dashboard"), setOpen(false);
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/settings"), setOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Projects">
            {projects?.map((project) => (
              <CommandItem
                key={project._id}
                onSelect={() => {
                  router.push(`/dashboard/${project.name}`);
                  setOpen(false);
                }}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                <span>{project.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <Protect
              condition={(has) =>
                has({ permission: "org:sys_memberships:manage" }) ||
                !organization
              }
              fallback={<></>}
            >
              <CommandItem onSelect={handleAddProject}>
                <FolderPlus className="mr-2 h-4 w-4" />
                <span>Add Project</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
            </Protect>
            <Protect
              condition={(has) =>
                has({ permission: "org:sys_memberships:manage" }) ||
                !organization
              }
              fallback={<></>}
            >
              <CommandItem onSelect={handleAddApiKey}>
                <Code className="mr-2 h-4 w-4" />
                <span>Add API Key</span>
              </CommandItem>

              <Protect
                condition={(has) =>
                  has({ permission: "org:sys_memberships:manage" }) ||
                  !organization
                }
                fallback={<></>}
              >
                <CommandItem onSelect={() => setIsInviteUsersDialogOpen(true)}>
                  <User2Icon className="mr-2 h-4 w-4" />
                  <span>Invite users</span>
                </CommandItem>
              </Protect>
            </Protect>

            <CommandItem onSelect={handleFeedback}>
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Feedback</span>
            </CommandItem>
            <CommandItem onSelect={handleCreateOrg}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Create organization</span>
            </CommandItem>
            <CommandItem onSelect={toggleTheme}>
              {theme === "light" ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              <span>Toggle Theme</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/settings/profile"), setOpen(false);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/dashboard/settings/billing"), setOpen(false);
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => router.push("/support")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </CommandItem>
            <CommandItem onSelect={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <AddProjectForm
        isOpen={isAddProjectDialogOpen}
        onClose={() => setIsAddProjectDialogOpen(false)}
      />
      <AddApiKey
        isFromCommand
        projectId={projects?.[0]?._id}
        isOpen={isAddApiKeyDialogOpen}
        onOpenChange={setIsAddApiKeyDialogOpen}
      >
        <></>
      </AddApiKey>
      <CreateOrganization open={createOrg} setOpen={setCreateOrg} />
      <Feedback
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
      <InviteMember
        open={isInviteUsersDialogOpen}
        setOpen={setIsInviteUsersDialogOpen}
      />
    </>
  );
}
