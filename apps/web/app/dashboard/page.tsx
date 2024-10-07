"use client";

import { useEffect, useState, useCallback } from "react";
import AddProjectForm from "@/components/dashboard/add-project-form";
import { Button } from "@/components/ui/button";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProjectGrid from "@/components/dashboard/project-grid";
import ProjectSearch from "@/components/dashboard/project-search";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OrganizationSwitcher,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";
import { Protect } from "@clerk/clerk-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getProjects } from "@/convex/projects";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InviteMember } from "@/components/dashboard/invite-user";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
export default function DashboardPage() {
  const { organization } = useOrganization();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInviteUsersDialogOpen, setIsInviteUsersDialogOpen] = useState(false);
  const ITEMS_PER_PAGE = 9;

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.projects.getPaginatedProjects,
    { organizationId: organization?.id || "" },
    { initialNumItems: ITEMS_PER_PAGE }
  );

  // Add this new state to track the total count of projects
  const [totalProjectCount, setTotalProjectCount] = useState<number>(0);

  // Use useEffect to update the total count when results change
  useEffect(() => {
    if (results) {
      // Assuming the API returns the total count in the last item
      const lastItem = results[results.length - 1];
      if (
        lastItem &&
        typeof lastItem === "object" &&
        "totalCount" in lastItem &&
        typeof lastItem.totalCount === "number"
      ) {
        setTotalProjectCount(lastItem.totalCount);
      } else {
        // If totalCount is not provided, use the length of results
        setTotalProjectCount(Math.max(results.length, 14)); // Ensure at least 14 for two buttons
      }
    }
  }, [results]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      if (newPage > currentPage) {
        loadMore(ITEMS_PER_PAGE);
      }
    },
    [currentPage, loadMore]
  );

  const handleCloseDialog = useCallback(() => {
    setIsAddProjectDialogOpen(false);
  }, []);

  // Update totalPages calculation
  const totalPages = Math.max(2, Math.ceil(totalProjectCount / ITEMS_PER_PAGE));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {organization?.name || "dashboard"}
      </h1>
      <div className="flex items-center justify-between space-x-4 mb-6">
        <div className="flex-grow">
          <ProjectSearch onSearch={handleSearch} disabled={isLoading} />
        </div>
        <Protect
          condition={(has) =>
            has({ permission: "org:sys_memberships:manage" }) || !organization
          }
          fallback={<></>}
        >
          <PopoverDemo
            open={setIsAddProjectDialogOpen}
            inviteUsers={setIsInviteUsersDialogOpen}
            organization={organization as Organization}
          />

          <AddProjectForm
            isOpen={isAddProjectDialogOpen}
            onClose={handleCloseDialog}
          />
        </Protect>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <>
            <ProjectGrid
              projects={results.slice(
                currentPage * ITEMS_PER_PAGE,
                (currentPage + 1) * ITEMS_PER_PAGE
              )}
              searchTerm={searchTerm}
            />
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(0, currentPage - 1))
                    }
                    aria-disabled={currentPage === 0}
                    className={
                      currentPage === 0 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      aria-disabled={index === 1 && results.length < 9}
                      onClick={() => handlePageChange(index)}
                      isActive={currentPage === index}
                      className={
                        index === 1 && results.length < 9
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(
                        Math.min(totalPages - 1, currentPage + 1)
                      )
                    }
                    aria-disabled={
                      currentPage === totalPages - 1 || results.length < 9
                    }
                    className={
                      currentPage === totalPages - 1 || results.length < 9
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <Protect
            condition={(has) =>
              has({ permission: "org:sys_memberships:manage" }) || !organization
            }
            fallback={<Fallback />}
          >
            <div className="flex flex-col items-center justify-center gap-4 text-center mt-12">
              <p>Add your first project to get started</p>
              <Button onClick={() => setIsAddProjectDialogOpen(true)}>
                Add Project
              </Button>

              <AddProjectForm
                isOpen={isAddProjectDialogOpen}
                onClose={handleCloseDialog}
              />
            </div>
          </Protect>
        )}
      </div>
      <InviteMember
        open={isInviteUsersDialogOpen}
        setOpen={setIsInviteUsersDialogOpen}
      />
    </div>
  );
}
type Organization = {
  id: string;
  name: string;
};
function Fallback() {
  return (
    <div className="text-center">
      Your organization does not have any projects yet.
    </div>
  );
}
function PopoverDemo({
  open,
  inviteUsers,
  organization,
}: {
  open: (open: boolean) => void;
  inviteUsers: (open: boolean) => void;
  organization: Organization;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <span>Add</span>
          <PlusIcon className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 shadow-lg rounded-lg max-w-xs">
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="default"
            className="w-full flex items-center space-x-2"
            onClick={() => open(true)}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Project</span>
          </Button>
          {organization && (
            <>
              <Separator className="w-full" />
              <Button
                variant="default"
                className="w-full flex items-center space-x-2"
                onClick={() => inviteUsers(true)}
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>Invite Users</span>
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
