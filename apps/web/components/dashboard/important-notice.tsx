"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { Protect, useOrganization } from "@clerk/nextjs";
import { InviteMember } from "./invite-user";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Image from "next/image";
import { Button } from "../ui/button";

export default function ImportantNotice() {
  const { organization } = useOrganization();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Protect
        condition={(has) => has({ permission: "org:sys_memberships:manage" })}
        fallback={<></>}
      >
        <Dialog>
          <DialogTrigger>
            <DialogTrigger2 />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Important Notice</DialogTitle>
              <DialogDescription>
                {organization
                  ? ImportantNoticeText(organization)
                  : "You are not in an organization"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(true)}>Invite Member</Button>
            </DialogFooter>
            <InviteMember open={open} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </Protect>
    </>
  );
}

type Organization = {
  name: string;
  id: string;
};

export const ImportantNoticeText = (organization: Organization) => (
  <Protect
    condition={(has) =>
      has({ permission: "org:sys_memberships:manage" }) || !organization
    }
    fallback={<></>}
  >
    <div className="text-foreground">
      <p className="mb-4">
        You are the admin of this organization:{" "}
        <span className="font-bold">{organization.name}</span>.
      </p>
      <p className="mb-4">
        Employees can install the keyzilla npm package with:
      </p>
      <pre className="bg-muted p-2 rounded mb-4">
        <code>npm install keyzilla</code>
        <br />
        <code>npx keyzilla pull</code>
      </pre>
      <p className="mb-4">
        They will need to authenticate with their email, password, or GitHub
        account. The tool will then fetch their projects and secrets.
      </p>

      <p>
        Adding employees is as simple as inviting them using the button below.
      </p>
    </div>
  </Protect>
);

function DialogTrigger2() {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CircleHelp className="text-lg  text-red-800 font-bold  " />
          </TooltipTrigger>
          <TooltipContent>
            <>Click me please 🐱</>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
