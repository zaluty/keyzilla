"use client";

import { useOrganizationList, useUser, useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronRight, ChevronsUpDown, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateOrganization from "./create-org";
import Link from "next/link";
/**
 *Switch between organizations and personal account
 *@returns {JSX.Element}
 *
 */
export const OrgSwitcher = () => {
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: false,
      pageSize: 3,
    },
  });
  const { user } = useUser();
  const { organization } = useOrganization();
  const [open, setOpen] = useState(false);
  const [createOrg, setCreateOrg] = useState(false);
  const router = useRouter();
  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-10 w-[200px]">
        <p>Loading...</p>
      </div>
    );
  }
  const handleOrgClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    router.push(`/dashboard/settings/org`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage
              src={organization ? organization.imageUrl : user.imageUrl}
              alt={organization?.name || user.fullName || ""}
            />
            <AvatarFallback>
              {organization?.name?.[0] || user.fullName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          {organization?.name || "Personal Account"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <ul className="max-h-[300px] overflow-auto space-y-1">
          <li
            key="personal"
            className={cn(
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
              !organization && "bg-accent"
            )}
            onClick={() => {
              setActive({ organization: null });
              setOpen(false);
            }}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
              <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span>Personal Account</span>
            {!organization && (
              <>
                {" "}
                <Check className="ml-auto h-4 w-4" />
              </>
            )}
          </li>
          {userMemberships.data?.map((mem) => (
            <li
              key={mem.organization.id}
              className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                mem.organization.id === organization?.id && "bg-accent"
              )}
              onClick={() => {
                setActive({ organization: mem.organization.id });
                setOpen(false);
                router.push("/dashboard");
              }}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage
                  src={mem.organization.imageUrl}
                  alt={mem.organization.name}
                />
                <AvatarFallback>{mem.organization.name[0]}</AvatarFallback>
              </Avatar>
              <span>{mem.organization.name}</span>
              {mem.organization.id === organization?.id && (
                <div className="flex items-center justify-center ml-auto">
                  <Link
                    href={`/dashboard/org`}
                    className="h-4 w-4"
                    onClick={(e) => handleOrgClick(e)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center justify-center w-full    p-2 text-sm text-muted-foreground"
        >
          Return to Dashboard
        </Link>
        {userMemberships.hasNextPage && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => userMemberships.fetchNext()}
            disabled={!userMemberships.hasNextPage}
          >
            Load more organizations
          </Button>
        )}
        <Button
          onClick={() => {
            setCreateOrg(true);
          }}
          className="my-4  mx-4"
        >
          Create Organization
        </Button>
        <CreateOrganization open={createOrg} setOpen={setCreateOrg} />
      </PopoverContent>
    </Popover>
  );
};
