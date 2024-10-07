import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import * as Sentry from "@sentry/nextjs";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

type FeedbackProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Feedback({ isOpen, onClose }: FeedbackProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [email, setEmail] = useState(user?.primaryEmailAddress);
  const path = usePathname();
  const [feedback, setFeedback] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const feedback = formData.get("feedback") as string | null;
    if (!feedback) {
      toast({
        title: "Feedback is missing",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await Sentry.captureFeedback({
        url: path,
        message: feedback,
        email: email?.emailAddress ?? undefined,
        name: user?.fullName ?? undefined,
      });
      if (result) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        });
      } else {
        throw new Error("Feedback not sent");
      }
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: "Please disable your adblocker and try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>
            Help us improve our platform by providing feedback{" "}
            <span className="text-red-400">
              (disable your adblocker so we&apos;ll receive your feedback)
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Textarea
            name="feedback"
            placeholder="What do you like about the product?"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" className="w-full mt-4">
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
