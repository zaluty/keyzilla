"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import crypto from "crypto";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, CopyIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, fromUnixTime } from "date-fns"; // Import fromUnixTime
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { decrypt } from "@/lib/encryption";

export default function Secrets() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const addSecret = useMutation(api.user.insertSecret);
  const deleteSecret = useMutation(api.user.deleteSecret);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const getSecret =
    useQuery(api.user.getSecret, { userId: user?.id ?? "" }) || [];

  // Add this type assertion
  const secretsArray = (Array.isArray(getSecret) ? getSecret : []) as Secret[];

  const generateEncryptedSecret = () => {
    const randomPart = crypto.randomBytes(16).toString("hex");
    const secret = `skey_${randomPart}`;
    const encryptedSecret = crypto
      .createHash("sha256")
      .update(secret)
      .digest("hex");
    return { secret, encryptedSecret };
  };

  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const [visibleSecrets, setVisibleSecrets] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSecretVisibility = (index: number) => {
    setVisibleSecrets((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyToClipboard = (text: string) => {
    try{

      text = decrypt(text, process.env.HASH_KEY as string); 
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }catch(err) {
      console.error("error copying", err);
    }
  };

  const [secretToDelete, setSecretToDelete] = useState<string | null>(null);

  const handleAddSecret = async () => {
    const { secret, encryptedSecret } = generateEncryptedSecret();
    await addSecret({ secret: secret }); // Store the original secret, not the hashed version
    setGeneratedSecret(secret);
    setOpen(false);
  };

  const handleDeleteSecret = async (secretValue: string) => {
    const success = await deleteSecret({ userId: user?.id ?? "", secretValue });
    if (success) {
      toast.success("Secret deleted successfully");
    } else {
      toast.error("Failed to delete secret");
    }
    setSecretToDelete(null);
  };

  // Helper function to format the date
  const formatDate = (dateValue: number | string) => {
    try {
      const date =
        typeof dateValue === "number"
          ? fromUnixTime(dateValue / 1000) // Convert milliseconds to seconds
          : new Date(dateValue);
      return format(date, "PPpp");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <CardTitle>Secrets</CardTitle>
        <AddSecretDialog
          onSubmit={handleAddSecret}
          open={open}
          setOpen={setOpen}
        />
      </CardHeader>
      <CardContent>
        {secretsArray.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Encrypted Secret</TableHead>
                  {isDesktop && <TableHead>Created At</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secretsArray.map((secret: Secret, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-[150px] truncate">
                      {visibleSecrets[index]
                        ? secret.encryptedSecret
                        : "••••••••••••••••"}
                    </TableCell>
                    {isDesktop && (
                      <TableCell>{formatDate(secret.createdAt)}</TableCell>
                    )}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSecretVisibility(index)}
                        >
                          {visibleSecrets[index] ? <EyeOffIcon /> : <EyeIcon />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(secret.encryptedSecret)
                          }
                        >
                          <CopyIcon />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSecretToDelete(secret.encryptedSecret)
                              }
                            >
                              <Trash2Icon />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the secret.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setSecretToDelete(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteSecret(secretToDelete!)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-lg">No secrets found.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Generate a new secret to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface Secret {
  encryptedSecret: string;
  createdAt: number;
}

type SecretDialogProps = {
  onSubmit: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

function AddSecretDialog({ onSubmit, open, setOpen }: SecretDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Generate New Secret</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Secret</DialogTitle>
            <DialogDescription>
              Generate a new encrypted secret for your account
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onSubmit}>Generate Secret</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Generate New Secret</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Generate New Secret</DrawerTitle>
          <DrawerDescription>
            Generate a new encrypted secret for your account
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={onSubmit}>Generate Secret</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
