import { useOrganization } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";

type RoleBasedAccessDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAllowedUsers?: string[]; // Make currentAllowedUsers optional
  onSave: (selectedUsers: string[]) => void; // Add onSave callback
};

export default function RoleBasedAccessDialog({
  isOpen,
  onOpenChange,
  currentAllowedUsers = [], // Provide default value
  onSave,
}: RoleBasedAccessDialogProps) {
  const { organization, memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedUsers, setSelectedUsers] =
    useState<string[]>(currentAllowedUsers);
  const [projectName, setProjectName] = useState("");

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    onSave(selectedUsers); // Call onSave callback with selected users
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-2">
            Select Users with Access:
          </DialogTitle>
        </DialogHeader>

        <ul className="space-y-2">
          {memberships?.data?.map((membership) => (
            <li
              key={membership.id}
              className="flex items-center justify-between"
            >
              <span>
                {membership.publicUserData.firstName}{" "}
                {membership.publicUserData.lastName}{" "}
                <span className="font-bold text-muted-foreground text-sm">
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
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
