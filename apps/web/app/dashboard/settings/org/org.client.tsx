"use client";
import {
  OrganizationProfile,
  Protect,
  useOrganization,
  useAuth,
} from "@clerk/nextjs";
import { useState, useEffect, useRef, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InviteMember } from "@/components/dashboard/invite-user";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Loader, Router } from "lucide-react";
import { OrganizationMembershipResource } from "@clerk/types";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface Invitation {
  id: string;
  emailAddress: string;
  role: string;
  status: string;
  createdAt: string;
  revoke: () => Promise<void>;
}

const userMembershipsParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export default function Organization() {
  const {
    organization,
    memberships,
    invitations: invitationsResponse,
  } = useOrganization();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [confirmInput, setConfirmInput] = useState<{
    type: "delete" | "revoke" | "remove";
    email: string;
    confirm: string;
  } | null>(null);
  const { has } = useAuth();

  const [orgMembers, setOrgMembers] = useState<
    OrganizationMembershipResource[]
  >([]);
  const [dialogAction, setDialogAction] = useState<{
    type: "revoke" | "remove" | "delete";
    id: string;
    email: string;
  } | null>(null);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);

  const canManage =
    has &&
    (has({ permission: "org:team_settings:manage" }) ||
      has({ role: "org:admin" }));

  const dataLoaded = useRef(false);

  const fetchData = useCallback(async () => {
    if (!organization || dataLoaded.current) return;

    setLoading(true);
    try {
      const [invitationsResponse, membershipsResponse] = await Promise.all([
        organization.getInvitations(),
        organization.getMemberships(),
      ]);

      setInvitations(
        invitationsResponse.data
          .filter((inv) => inv.status !== "revoked")
          .map((inv) => ({
            ...inv,
            revoke: async () => {
              await inv.revoke();
            },
            createdAt: inv.createdAt.toISOString(),
          }))
      );

      setOrgMembers(membershipsResponse.data);

      // Update memberships data if needed
      dataLoaded.current = true;
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
      toast({
        title: "Error fetching data",
        description: (error as Error).message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [organization, toast]);

  useEffect(() => {
    if (canManage) {
      fetchData();
    }
  }, [fetchData, canManage]);

  if (!canManage) {
    return (
      <>
        <OrganizationProfile routing="hash" />
      </>
    );
  }

  // we need to handle the dialog action based on the type
  // if the type is delete we need to delete the organization
  // if the type is revoke we need to revoke the invitation
  // if the type is remove we need to remove the user
  const handleAction = async () => {
    if (!dialogAction) return;

    if (dialogAction.type === "revoke") {
      await revokeInvitation(dialogAction.id);
    } else if (dialogAction.type === "remove") {
      await removeUser(dialogAction.id);
    } else if (dialogAction.type === "delete") {
      await deleteOrganization();
    }

    setDialogAction(null);
  };

  const deleteOrganization = async () => {
    try {
      await organization?.destroy();
      router.refresh();
      router.push("/dashboard/settings");
      toast({
        title: "Organization deleted",
        description: "Your organization has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error deleting organization",
        description: "An error occurred while deleting the organization.",
        variant: "destructive",
      });
    }
  };

  if (!organization) return null;

  const formatRole = (role: string) => {
    switch (role) {
      case "org:admin":
        return "Admin";
      case "org:member":
        return "Member";
      default:
        return "Unknown";
    }
  };

  const revokeInvitation = async (invitationId: string) => {
    try {
      const invitationToRevoke = invitations.find(
        (inv) => inv.id === invitationId
      );
      if (invitationToRevoke) {
        await invitationToRevoke.revoke();
        setInvitations(invitations.filter((inv) => inv.id !== invitationId));
        await Promise.all([
          memberships?.revalidate,
          invitationsResponse?.revalidate,
        ]);
        toast({
          title: "Invitation revoked",
          description: "The invitation has been successfully revoked.",
        });
      }
    } catch (error) {
      toast({
        title: "Error revoking invitation",
        description: "An error occurred while revoking the invitation.",
        variant: "destructive",
      });
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await organization.removeMember(userId);
      router.refresh;
      await memberships?.revalidate?.();
      toast({
        title: "User removed",
        description:
          "The user has been successfully removed from the organization.",
      });
    } catch (error) {
      toast({
        title: "Error removing user",
        description: "An error occurred while removing the user.",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      if (organization) {
        await organization.updateMember({
          userId,
          role: newRole,
        });

        // Update the local state
        setOrgMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.publicUserData.userId === userId
              ? { ...member, role: newRole }
              : member
          )
        );

        await memberships?.revalidate?.();
        toast({
          title: "Role updated",
          description: "The user's role has been successfully updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error updating role",
        description: "An error occurred while updating the user's role.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <Tabs defaultValue="members">
        <div className=" mb-10 flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Image
              className="h-12 w-12 rounded-full sm:h-[50px] sm:w-[50px]"
              src={organization.imageUrl}
              alt={organization.name}
              width={50}
              height={50}
            />
            <h1 className="text-xl font-bold sm:text-2xl">
              {organization.name}
            </h1>
          </div>
          <Button onClick={() => setOpen(true)}>Invite Member</Button>
        </div>
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-destructive  hover:bg-destructive/20"
          >
            Danger Zone
          </TabsTrigger>
        </TabsList>
        <InviteMember open={open} setOpen={setOpen} />
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Organization Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Joined
                    </TableHead>
                    <TableHead className="hidden sm:table-cell text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgMembers.map((member) => (
                    <TableRow key={member.id}>
                      {isMobile ? (
                        <Drawer
                          open={openDrawer === member.id}
                          onOpenChange={(open) =>
                            setOpenDrawer(open ? member.id : null)
                          }
                        >
                          <DrawerTrigger asChild>
                            <TableCell className="cursor-pointer hover:bg-muted">
                              {member.publicUserData.identifier}
                            </TableCell>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader className="border-b pb-4">
                              <DrawerTitle className="text-xl font-bold">
                                Member Details
                              </DrawerTitle>
                            </DrawerHeader>
                            <div className="p-6 space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <p className="font-semibold">Email:</p>
                                <p>{member.publicUserData.identifier}</p>
                                <p className="font-semibold">Role:</p>
                                <Protect
                                  condition={(has) =>
                                    has({
                                      permission: "org:sys_memberships:manage",
                                    }) || !organization
                                  }
                                  fallback={<></>}
                                >
                                  <Select
                                    defaultValue={member.role}
                                    onValueChange={(newRole) =>
                                      updateUserRole(
                                        member.publicUserData.userId!,
                                        newRole
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="org:admin">
                                        Admin
                                      </SelectItem>
                                      <SelectItem value="org:member">
                                        Member
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </Protect>
                                <p className="font-semibold">Joined:</p>
                                <p>
                                  {format(new Date(member.createdAt), "PPP")}
                                </p>
                              </div>
                            </div>
                            <DrawerFooter className="border-t pt-4">
                              {member.role !== "org:admin" && (
                                <>
                                  <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                      setDialogAction({
                                        type: "remove",
                                        id: member.publicUserData.userId!,
                                        email: member.publicUserData.identifier,
                                      });
                                      setOpenDrawer(null);
                                    }}
                                  >
                                    Remove Member
                                  </Button>
                                </>
                              )}
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      ) : (
                        <TableCell>
                          {member.publicUserData.identifier}
                        </TableCell>
                      )}
                      <TableCell className="hidden sm:table-cell">
                        <Select
                          defaultValue={member.role}
                          onValueChange={(newRole) =>
                            updateUserRole(
                              member.publicUserData.userId!,
                              newRole
                            )
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="org:admin">Admin</SelectItem>
                            <SelectItem value="org:member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {format(new Date(member.createdAt), "PPP")}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        {member.role !== "org:admin" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setDialogAction({
                                type: "remove",
                                id: member.publicUserData.userId!,
                                email: member.publicUserData.identifier,
                              })
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          {loading ? (
            <Loader />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Invitations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Role
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Invited At
                      </TableHead>
                      <TableHead className="hidden sm:table-cell text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        {isMobile ? (
                          <Drawer
                            open={openDrawer === invitation.id}
                            onOpenChange={(open) =>
                              setOpenDrawer(open ? invitation.id : null)
                            }
                          >
                            <DrawerTrigger asChild>
                              <TableCell className="cursor-pointer hover:bg-muted">
                                {invitation.emailAddress}
                              </TableCell>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader className="border-b pb-4">
                                <DrawerTitle className="text-xl font-bold">
                                  Invitation Details
                                </DrawerTitle>
                              </DrawerHeader>
                              <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <p className="font-semibold">Email:</p>
                                  <p>{invitation.emailAddress}</p>
                                  <p className="font-semibold">Role:</p>
                                  <p>{formatRole(invitation.role)}</p>
                                  <p className="font-semibold">Status:</p>
                                  <Badge
                                    className={
                                      invitation.status === "pending"
                                        ? "bg-orange-500/50 text-orange-500 text-center hover:bg-orange-500/50"
                                        : "bg-green-500/50 text-green-500 text-center hover:bg-green-500/50"
                                    }
                                  >
                                    <span className="w-full text-center">
                                      {invitation.status}
                                    </span>
                                  </Badge>
                                  <p className="font-semibold">Invited At:</p>
                                  <p>
                                    {format(
                                      new Date(invitation.createdAt),
                                      "PPP"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <DrawerFooter className="border-t pt-4">
                                {invitation.status !== "accepted" && (
                                  <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                      setDialogAction({
                                        type: "revoke",
                                        id: invitation.id,
                                        email: invitation.emailAddress,
                                      });
                                      setOpenDrawer(null);
                                    }}
                                  >
                                    Revoke Invitation
                                  </Button>
                                )}
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        ) : (
                          <TableCell>{invitation.emailAddress}</TableCell>
                        )}
                        <TableCell className="hidden sm:table-cell">
                          {formatRole(invitation.role)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="default">{invitation.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {format(new Date(invitation.createdAt), "PPP")}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setDialogAction({
                                type: "revoke",
                                id: invitation.id,
                                email: invitation.emailAddress,
                              })
                            }
                            disabled={invitation.status === "accepted"}
                            className={
                              invitation.status === "accepted" ? "hidden" : ""
                            }
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Actions in this section can have serious consequences. Proceed
                  with caution.
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                className="w-full mt-4"
                onClick={() =>
                  setDialogAction({
                    type: "delete",
                    id: organization?.id!,
                    email: organization?.name!,
                  })
                }
              >
                Delete Organization
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!dialogAction}
        onOpenChange={() => setDialogAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction?.type === "delete"
                ? "Delete Organization"
                : dialogAction?.type === "revoke"
                  ? "Revoke Invitation"
                  : "Remove User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {dialogAction?.type === "revoke"
                ? "revoke the invitation for"
                : dialogAction?.type === "remove"
                  ? "remove"
                  : "delete"}{" "}
              <span className="font-bold ">{dialogAction?.email}</span> ? This
              action cannot be undone.
              <Input
                placeholder={`Enter ${dialogAction?.email} to confirm`}
                className="mt-4"
                value={confirmInput?.confirm}
                onChange={(e) =>
                  setConfirmInput((prev) => ({
                    ...prev!,
                    confirm: e.target.value,
                  }))
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={
                confirmInput?.confirm !== dialogAction?.email ||
                !confirmInput?.confirm
              }
            >
              {dialogAction?.type === "revoke" ? "Revoke" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
