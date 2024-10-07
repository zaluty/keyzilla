"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { OAuthStrategy } from "@clerk/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Github } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ... existing code ...

export default function CliPage() {
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useSignIn();
  const searchParams = useSearchParams();
  const [otpChecked, setOtpChecked] = useState(false);
  const success = searchParams.get("success");
  const otp = searchParams.get("device_code");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
    },
  });

  if (success === "true") {
    return <SuccessPage />;
  } else if (success === "false") {
    return <ErrorPage />;
  }

  if (!signIn) return null;

  const signInWith = (strategy: OAuthStrategy) => {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");
    const recentRequests = requests.filter(
      (time: number) => now - time < 60000
    );

    if (recentRequests.length >= 5) {
      setError("Rate limit exceeded. Please try again later.");
      return;
    }

    // Update requests in localStorage
    localStorage.setItem("requests", JSON.stringify([...recentRequests, now]));

    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-up/sso-callback",
      redirectUrlComplete: "/cli?success=true",
    });
  };

  const handleGithubSignIn = () => {
    if (!error) {
      signInWith("oauth_github");
    }
  };

  const onSubmit = async (data: { email: string }) => {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");
    const recentRequests = requests.filter(
      (time: number) => now - time < 60000
    );

    if (recentRequests.length >= 5) {
      setError("Rate limit exceeded. Please try again later.");
      return;
    }

    try {
      const response = await axios.get(`/api/cli?email=${data.email}`);

      // Update requests in localStorage
      localStorage.setItem(
        "requests",
        JSON.stringify([...recentRequests, now])
      );
      setError(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black text-white">
      {!otpChecked && (
        <div className="text-xl font-bold mb-6 text-center">
          Make sure this OTP code is the one showed in your terminal:{" "}
          <span className="font-bold text-green-500">{otp}</span>
          <div className="flex-col-2 gap-4 ">
            <Button
              onClick={() => setOtpChecked(true)}
              className="mt-4 bg-green-500 hover:bg-green-600 w-full"
            >
              Yes, this is the correct OTP code
            </Button>
            <Button
              onClick={() => {
                setOtpChecked(false);
                router.push("/cli?success=false");
              }}
              className="mt-4 bg-red-500 hover:bg-red-600 w-full"
            >
              No, this is not the correct OTP code
            </Button>
          </div>
        </div>
      )}
      {otpChecked && (
        <div className="max-w-md mx-auto mt-10 p-6">
          <h1 className="text-xl font-bold mb-6 text-center">
            Authenticate to continue
          </h1>
          <Form {...form}>
            <div className="flex flex-col gap-2 mb-4">
              <Button
                onClick={handleGithubSignIn}
                variant="outline"
                className="bg-white text-black"
              >
                <Github className="mr-2 h-4 w-4" />
                Sign in with Github
              </Button>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">
          <CircleCheck className="mr-2 h-8 w-8 text-green-500" to={"/"} />
          Success!
        </h1>
        <p className="text-muted-foreground mb-6  ">
          Your account has been successfully set up.{" "}
          <span className="text-sm text-muted-foreground font-bold">
            You can now close this window and return to your terminal to
            continue using the CLI.
          </span>
        </p>
        <Button asChild className="w-full">
          <Link href="/">Return to home</Link>
        </Button>
      </div>
    </div>
  );
}

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">
          <CircleX className="mr-2 h-8 w-8 text-red-500" to={"/"} />
          Error!
        </h1>
        <p className="text-muted-foreground mb-6  ">
          An error occurred while setting up your account. Please try again.
        </p>
        <Button asChild className="w-full">
          <Link href="/cli">Try again</Link>
        </Button>
      </div>
    </div>
  );
}
