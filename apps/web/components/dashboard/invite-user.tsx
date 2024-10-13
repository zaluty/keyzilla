"use client";

import { useOrganization } from "@clerk/nextjs";
import { OrganizationCustomRoleKey } from "@clerk/types";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const inviteFormSchema = z.object({
  emails: z.string().min(1, "At least one email is required"),
  role: z.string().min(1, "Role is required"),
});

export const OrgMembersParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export const OrgInvitationsParams = {
  invitations: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

// Form to invite a new member to the organization.
interface InviteMemberProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const InviteMember: React.FC<InviteMemberProps> = ({
  open,
  setOpen,
}) => {
  const { isLoaded, organization, invitations } =
    useOrganization(OrgInvitationsParams);
  const [disabled, setDisabled] = useState(false);
  const { toast, dismiss } = useToast();

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      emails: "",
      role: "",
    },
  });

  if (!isLoaded || !organization) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    setDisabled(true);
    const emailList = values.emails
      .split(/[,\s]+/)
      .filter((email) => email.trim() !== "");

    const results = await Promise.allSettled(
      emailList.map((email) =>
        organization.inviteMember({
          emailAddress: email.trim(),
          role: values.role as OrganizationCustomRoleKey,
        })
      )
    );

    const successfulInvites = results.filter(
      (result) => result.status === "fulfilled"
    );
    const failedInvites = results.filter(
      (result) => result.status === "rejected"
    );

    await invitations?.revalidate?.();
    form.reset();

    if (successfulInvites.length > 0) {
      toast({
        title: "Invitations sent",
        description: `Successfully sent invitations to ${successfulInvites.length} email(s).`,
      });
    }

    if (failedInvites.length > 0) {
      const failedEmails = failedInvites.map((_, index) => emailList[index]);
      toast({
        title: "Some invitations failed",
        description: `Failed to send invitations to: ${failedEmails.join(", ")}`,
        variant: "destructive",
        action: (
          <Button onClick={() => dismiss()}>
            <X className="w-4 h-4" />
          </Button>
        ),
      });
    }

    setOpen(false);
    setDisabled(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Members</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email addresses</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter email addresses (comma or space separated)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <SelectRole fieldName="role" onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={disabled} className="w-full">
              {disabled ? "Sending Invitations..." : "Invite Members"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type SelectRoleProps = {
  fieldName?: string;
  isDisabled?: boolean;
  onChange?: (value: string) => void; // Changed from ChangeEventHandler<HTMLSelectElement>
  defaultRole?: string;
};

const SelectRole = (props: SelectRoleProps) => {
  const { fieldName, isDisabled = false, onChange, defaultRole } = props;
  const { organization } = useOrganization();
  const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
  const isPopulated = useRef(false);

  useEffect(() => {
    if (isPopulated.current) return;
    organization
      ?.getRoles({
        pageSize: 20,
        initialPage: 1,
      })
      .then((res) => {
        isPopulated.current = true;
        setRoles(
          res.data.map((roles) => roles.key as OrganizationCustomRoleKey)
        );
      });
  }, [organization?.id]);

  if (fetchedRoles.length === 0) return null;

  return (
    <Select
      name={fieldName}
      disabled={isDisabled}
      onValueChange={onChange}
      defaultValue={defaultRole}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {fetchedRoles?.map((roleKey) => (
          <SelectItem key={roleKey} value={roleKey}>
            {roleKey}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// List of pending invitations to an organization.
export const InvitationList = () => {
  const { isLoaded, invitations, memberships } = useOrganization({
    ...OrgInvitationsParams,
    ...OrgMembersParams,
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations?.data?.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.emailAddress}</TableCell>
                  <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>{inv.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await inv.revoke();
                        await Promise.all([
                          memberships?.revalidate,
                          invitations?.revalidate,
                        ]);
                      }}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={!invitations?.hasPreviousPage || invitations?.isFetching}
            onClick={() => {
              invitations?.fetchPrevious?.();
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!invitations?.hasNextPage || invitations?.isFetching}
            onClick={() => invitations?.fetchNext?.()}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
