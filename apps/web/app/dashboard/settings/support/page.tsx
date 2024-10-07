"use client";
import Feedback from "@/components/feedback";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Support() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Choose an option to get support or provide feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="w-full"
          >
            Leave us feedback
          </Button>
          <Button asChild className="w-full">
            <Link
              href="https://github.com/zaluty/keyzilla/issues/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              Open an issue on GitHub
            </Link>
          </Button>
          <Separator className="my-4" />
          <Button variant="outline" className="w-full" asChild>
            <Link
              href="mailto:support@keyzilla.dev"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact us by email
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Feedback isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
