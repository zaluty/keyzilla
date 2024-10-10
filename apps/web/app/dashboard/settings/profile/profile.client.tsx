"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import Head from "next/head";

const profileFormSchema = z.object({
  username: z.string().min(2).max(30),
  firstName: z.string().min(2).max(50),
});

export default function ProfilePage() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      firstName: user?.firstName || "",
    },
  });

  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("No user found");
      }

      await user.update({
        username: data.username,
        firstName: data.firstName,
      });

      // Reload the user data to reflect changes
      await user.reload();

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      let errorMessage = "An error occurred while updating your profile.";
      if (error instanceof Error) {
        if (error.message.includes("username")) {
          errorMessage =
            "This username is already taken. Please choose another.";
        } else {
          errorMessage += ` ${error.message}`;
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Login Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Email:</span>
              <span className="text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
            {user?.externalAccounts.find(
              (account) => account.provider === "github"
            ) ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">GitHub Account:</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">GitHub Username:</span>
                  <a
                    href={`https://github.com/${user.externalAccounts.find((account) => account.provider === "github")?.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {
                      user.externalAccounts.find(
                        (account) => account.provider === "github"
                      )?.username
                    }
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-medium">Password:</span>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
