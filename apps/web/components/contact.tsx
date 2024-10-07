import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";

export const description =
  "A sign up form with first name, last name, email and password inside a dialog. There's an option to sign up with GitHub and a link to login if you already have an account";

export function ContactForm({ open, children }: { open: boolean, children: React.ReactNode }) {
  const { user } = useUser();
  return (
    <Dialog open={open}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="mx-auto max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Contact Us</DialogTitle>
          <DialogDescription>
            Enter your information to contact us
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder={user?.firstName || ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder={user?.lastName || ""}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={user?.emailAddresses[0].emailAddress || ""}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
