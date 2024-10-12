import { useOrganization, useUser } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type RoleBasedAccessCardProps = {
  currentAllowedUsers?: string[];
  onUsersChange: (selectedUsers: string[]) => void;
};

export default function RoleBasedAccessCard({
  currentAllowedUsers = [],
  onUsersChange,
}: RoleBasedAccessCardProps) {
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const { user } = useUser();
  const [selectedUsers, setSelectedUsers] =
    useState<string[]>(currentAllowedUsers);

  const handleUserToggle = (userId: string) => {
    const updatedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    setSelectedUsers(updatedUsers);
    onUsersChange(updatedUsers);
  };

  const scrollAreaHeight = useMemo(() => {
    const userCount = memberships?.data?.length || 0;
    const baseHeight = 50; // Height of a single user item
    const maxHeight = 300; // Maximum height of the scroll area
    return Math.min(userCount * baseHeight, maxHeight);
  }, [memberships?.data?.length]);

  const filteredMemberships = useMemo(() => {
    return memberships?.data?.filter(
      (membership) => membership.publicUserData.userId !== user?.id
    );
  }, [memberships?.data, user?.id]);

  const handleSelectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    const allUserIds =
      filteredMemberships?.map(
        (membership) => membership.publicUserData.userId!
      ) || [];
    const newSelectedUsers =
      selectedUsers.length === allUserIds.length ? [] : allUserIds;
    setSelectedUsers(newSelectedUsers);
    onUsersChange(newSelectedUsers);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Select Users with Access:</span>
          <InfoIcon />
        </CardTitle>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            type="button" // Explicitly set button type to prevent form submission
          >
            {selectedUsers.length === filteredMemberships?.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`h-[${scrollAreaHeight}px] pr-4`}>
          <ul className="space-y-2">
            {filteredMemberships?.map((membership) => (
              <li
                key={membership.id}
                className="flex items-center justify-between"
              >
                <span>
                  {membership.publicUserData.firstName}{" "}
                  {membership.publicUserData.lastName}
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
        </ScrollArea>
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
            Only users you select will have access to this project. You
            don&apos;t see yourself because you are the one creating the
            project.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
