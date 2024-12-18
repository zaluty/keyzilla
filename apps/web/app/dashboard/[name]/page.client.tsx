"use client";
import { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Protect, useOrganization } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Code,
  Copy,
  Info,
  Key,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Settings from "@/components/dashboard/project/settings";
import { AddApiKey } from "@/components/dashboard/add-api-key";
import { useSearchParams } from "next/navigation";
import   UsageChart   from "@/components/dashboard/project/usage-chart";
import EditApiKey from "@/components/dashboard/edit-api-key";
import { format } from "date-fns";
import ImportantNotice from "@/components/dashboard/important-notice";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { encrypt, decrypt } from "@/lib/encryption";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import Users from "@/components/dashboard/project/users";

export default function ProjectPage({ params }: { params: { name: string } }) {
  const { organization } = useOrganization();
  const [projectId, setProjectId] = useState<Id<"projects"> | null>(null);
  const [isAddApiKeyDialogOpen, setIsAddApiKeyDialogOpen] = useState(false);
  const [isEditApiKeyDialogOpen, setIsEditApiKeyDialogOpen] = useState(false);

  const [selectedApiKey, setSelectedApiKey] = useState<Id<"apiKeys"> | null>(
    null
  );
  const searchParams = useSearchParams();
  const { user } = useUser();
  const project = useQuery(api.projects.getProjectByName, {
    name: decodeURIComponent(params.name),
    organizationId: organization?.id || "",
  });
  const { toast } = useToast();
  useEffect(() => {
    if (project) {
      setProjectId(project._id);
    }
  }, [project]);

  useEffect(() => {
    if (searchParams.get("addApiKey") === "true") {
      setIsAddApiKeyDialogOpen(true);
    }
  }, [searchParams]);

  const apiKeys = useQuery(
    api.apiKeys.getApiKeys,
    projectId ? { projectId } : "skip"
  );

  const [newApiKey, setNewApiKey] = useState("");
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const createApiKey = useMutation(api.apiKeys.createApiKey);
  const deleteApiKey = useMutation(api.apiKeys.deleteApiKey);

  const [selectedApiKeyForDrawer, setSelectedApiKeyForDrawer] =
    useState<Doc<"apiKeys"> | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (project === undefined) {
    return <ProjectSkeleton />;
  }

  if (project === null) {
    return <NotFound name={params.name} />;
  }

  const handleCreateApiKey = async () => {
    try {
      await createApiKey({
        projectId: project._id,
        value: encrypt(newApiKey, process.env.HASH_KEY as string),
        name: newApiKeyName,
      });
      setNewApiKey("");
      setNewApiKeyName("");
      toast({
        title: "API Key created successfully",
      });
    } catch (error) {
      console.log("Debug: Error creating API Key", error);
      toast({
        title: "Failed to create API Key",
      });
    }
  };

  const handleDeleteApiKey = async (apiKeyId: Id<"apiKeys">) => {
    try {
      await deleteApiKey({ apiKeyId });
      toast({
        title: "API Key deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete API Key",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    try   {

      navigator.clipboard.writeText(decrypt(text, process.env.HASH_KEY as string));
      toast({
        title: "Copied to clipboard",
      });
    } catch(err) {
      console.error("error copying", err);
    }
  };

  const handleEditApiKey = (apiKeyId: Id<"apiKeys">) => {
    setSelectedApiKey(apiKeyId);
    setIsEditApiKeyDialogOpen(true);
  };

  const handleApiKeyClick = (apiKey: Doc<"apiKeys">) => {
    if (isMobile) {
      setSelectedApiKeyForDrawer(apiKey);
    }
  };

  const closeDrawer = () => {
    setSelectedApiKeyForDrawer(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="bg-card text-card-foreground">
        <CardHeader className="flex flex-col gap-y-4 p-6 bg-card text-card-foreground rounded-lg shadow-lg">
          <div className="flex flex-col items-start gap-y-4">
            <Link
              href="/dashboard"
              className="flex items-center hover:text-default-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Dashboard
            </Link>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-4xl font-extrabold">
                {project.name}
              </CardTitle>
              <ImportantNotice />
            </div>
          </div>
          <p className="text-lg opacity-90">{project.description}</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>

          {organization ? (
            <Protect role="org:admin">
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </Protect>
          ) : (
            <TabsTrigger value="settings">Settings</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center justify-between">
                <div className="flex items-center">
                  <Code className="mr-2" /> API Keys
                </div>
                {organization ? (
                  <Protect role="org:admin" fallback={<></>}>
                    <AddApiKey
                      projectId={project._id}
                      isOpen={isAddApiKeyDialogOpen}
                      onOpenChange={setIsAddApiKeyDialogOpen}
                    >
                      <Button>Add API key</Button>
                    </AddApiKey>
                  </Protect>
                ) : (
                  <AddApiKey
                    projectId={project._id}
                    isOpen={isAddApiKeyDialogOpen}
                    onOpenChange={setIsAddApiKeyDialogOpen}
                  >
                    <Button>Add API key</Button>
                  </AddApiKey>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>API Key</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created At
                      </TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <p className="text-gray-500">
                            No API keys found. Add one to get started.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                    {apiKeys?.map((apiKey) => (
                      <TableRow
                        key={apiKey._id}
                        onClick={() => handleApiKeyClick(apiKey)}
                        className={isMobile ? "cursor-pointer" : ""}
                      >
                        <TableCell className="font-mono">
                          {apiKey.name || "No name"}
                          </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary">
                            {format(new Date(apiKey.createdAt), "PPP")}
                          </Badge>
                        </TableCell>
                        <TableCell>   
                          <Badge variant="outline">
                            {apiKey.isServer ? "Server" : "Client"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(apiKey.apiKey)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Protect
                              condition={(has) =>
                                has({
                                  permission: "org:sys_memberships:manage",
                                }) || !organization
                              }
                              fallback={<></>}
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditApiKey(apiKey._id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Protect>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="usage">
          <UsageChart projectId={project._id} projectName={project.name} />
        </TabsContent>
        <TabsContent value="settings">
          <Settings project={project} />
        </TabsContent>
        <TabsContent value="users">
          <Users projectId={project._id} />
        </TabsContent>
      </Tabs>
      {selectedApiKey && (
        <EditApiKey
          projectId={project._id}
          apiKeyId={selectedApiKey}
          apiKeyName={
            apiKeys?.find((ak) => ak._id === selectedApiKey)?.name ?? ""
          }
          isOpen={isEditApiKeyDialogOpen}
          onOpenChange={setIsEditApiKeyDialogOpen}
        />
      )}

      <Drawer open={!!selectedApiKeyForDrawer} onOpenChange={closeDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {selectedApiKeyForDrawer?.name || "API Key Details"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <p>
              <strong>API Key:</strong>{" "}
              {decrypt(selectedApiKeyForDrawer?.apiKey || "s", process.env.HASH_KEY as string)}...
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {selectedApiKeyForDrawer &&
                format(new Date(selectedApiKeyForDrawer.createdAt), "PPP")}
            </p>
            <p>
              <strong>Environment:</strong>{" "}
              <Badge variant="outline">
                {selectedApiKeyForDrawer?.isServer ? "Server" : "Client"}
              </Badge>
            </p>
          </div>
          <DrawerFooter className="flex-row justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(selectedApiKeyForDrawer?.apiKey || " No key found")
              }
            >
              <Copy className="h-4 w-4 mr-2 cursor-pointer" /> Copy
            </Button>
            <Protect
              condition={(has) =>
                has({
                  permission: "org:sys_memberships:manage",
                }) || !organization
              }
              fallback={<></>}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleEditApiKey(
                    selectedApiKeyForDrawer?._id as Id<"apiKeys">
                  );
                  closeDrawer();
                }}
              >
                <Pencil className="h-4 w-4 mr-2 cursor-pointer" /> Edit
              </Button>
            </Protect>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Skeleton className="h-40 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function NotFound({ name }: { name: string }) {
  return (
    <Card className="bg-card text-card-foreground w-1/2 mx-auto mt-16">
      <CardHeader>
        <CardTitle>Project not found</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          The project <span className="font-bold underline">{name}</span> you
          are looking for does not exist. or has been deleted.
        </p>
        <p className="text-4xl font-bold text-center">404</p>
      </CardContent>
    </Card>
  );
}
