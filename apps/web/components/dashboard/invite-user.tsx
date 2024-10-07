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

const inviteFormSchema = z.object({
  email: z.string().email("Invalid email address"),
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

/*************  ✨ Codeium Command ⭐  *************/
/**
 * A dialog to invite a new member to the organization. The dialog is only
 * rendered when the organization is loaded, and the user has the necessary
 * permissions to invite new members.
 *
 * @param open - Whether the dialog is currently open.
 * @param setOpen - A function to set the open state of the dialog.
 */

/******  ac1c8d08-a01a-44f4-a3c7-9cc6cf45ea31  *******/
export const InviteMember: React.FC<InviteMemberProps> = ({
  open,
  setOpen,
}) => {
  const { isLoaded, organization, invitations } =
    useOrganization(OrgInvitationsParams);
  const [disabled, setDisabled] = useState(false);

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  if (!isLoaded || !organization) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    setDisabled(true);
    try {
      await organization.inviteMember({
        emailAddress: values.email,
        role: values.role as OrganizationCustomRoleKey,
      });
      await invitations?.revalidate;
      form.reset();
    } catch (error) {
      console.error("Error inviting member:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a New Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
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
            <Button
              type="submit"
              disabled={disabled}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Invite Member
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
