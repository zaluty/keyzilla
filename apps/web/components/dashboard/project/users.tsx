"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser, useOrganization } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Users({ projectId }: { projectId: Id<"projects"> }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const users = useQuery(api.projects.getProjectUsers, { projectId });
  const updateProject = useMutation(api.projects.updateProjectAllowedUsers);
  const [userData, setUserData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [selectedUsers, setSelectedUsers] = useState<string[]>(users || []);

  const filteredMemberships = useMemo(() => {
    return memberships?.data || [];
  }, [memberships?.data]);

  const handleUserToggle = async (userId: string) => {
    const updatedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    setSelectedUsers(updatedUsers);

    try {
      await updateProject({ projectId, allowedUsers: updatedUsers });
      toast({
        title: "User access updated successfully",
      });
    } catch (error) {
      console.error("Error updating user access:", error);
      toast({
        variant: "destructive",
        title: "Failed to update user access. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!users || users.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(`/api/user?projectId=${projectId}`, {
          userIds: users,
        });
        setUserData(response.data.users);
        setSelectedUsers(users);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(`Failed to fetch user data. Please try again later.`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isUserLoaded && users !== undefined) {
      fetchUsers();
    }
  }, [projectId, users, isUserLoaded]);
  const scrollAreaHeight = useMemo(() => {
    const userCount = memberships?.data?.length || 0;
    const baseHeight = 50; // Height of a single user item
    const maxHeight = 300; // Maximum height of the scroll area
    return Math.min(userCount * baseHeight, maxHeight);
  }, [memberships?.data?.length]);
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <CardTitle>Users with Access</CardTitle>
          <span className="text-sm text-muted-foreground">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
            have access to this project.
          </span>
          <InfoIcon />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 sm:mt-0 w-full sm:w-auto">
              Manage User Access
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <ScrollArea className={`h-[${scrollAreaHeight}px] pr-4`}>
              <ul className="space-y-2">
                {filteredMemberships?.map((membership) => (
                  <li
                    key={membership.id}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {[
                        membership.publicUserData.firstName,
                        membership.publicUserData.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") || "Unnamed User"}
                      <span className="font-bold text-muted-foreground text-sm ml-2">
                        {membership.publicUserData.identifier}
                      </span>
                    </span>
                    <Checkbox
                      checked={selectedUsers.includes(
                        membership.publicUserData?.userId ?? ""
                      )}
                      onCheckedChange={() =>
                        handleUserToggle(membership.publicUserData.userId!)
                      }
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : isLoading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : userData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((userData) => (
                <TableRow key={userData.id}>
                  <TableCell>
                    <Image
                      src={userData.imageUrl}
                      alt={userData.name || "User avatar"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {userData.id === user?.id ? (
                      <span>
                        {userData.name || "N/A"}{" "}
                        <span className="text-sm text-muted-foreground">
                          (You)
                        </span>
                      </span>
                    ) : (
                      userData.name + " " + userData.lastName || "N/A"
                    )}
                  </TableCell>
                  <TableCell>{userData.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-gray-500">No users found</div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="w-64">
            Only users you select will have access to this project.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
