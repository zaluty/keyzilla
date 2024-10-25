"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Protect, useOrganization } from "@clerk/nextjs";
import { useMediaQuery } from "@/hooks/use-media-query";
 
const formSchema = z.object({
  apiKeyValue: z.string().optional(),
  name: z.string().optional(),
  isServer: z.boolean().optional(),
  apiKeyName: z.string().optional(),
});
 interface ApiKey {
  _id: Id<"apiKeys">;
 
}

export default function EditApiKey({
  apiKeyId,
  isOpen,
  onOpenChange,
  projectId,
  apiKeyName,
}: {
  apiKeyId: Id<"apiKeys">;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  apiKeyName: string;
  projectId: Id<"projects">;
}) {
  const updateApiKey = useMutation(api.apiKeys.updateApiKey);
  const getApiKey = useQuery(api.apiKeys.getApiKeys, { projectId });
  const { organization } = useOrganization();
  const deleteApiKey = useMutation(api.apiKeys.deleteApiKey);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKeyValue: "",
      isServer: false,
    },
  });
  const apiKey = getApiKey?.find((ak: ApiKey) => ak._id === apiKeyId);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State to control visibility of delete dialog this comment is defenitely written by AI
    const handleDeleteApiKey = async () => {
    setShowDeleteDialog(true);
    if (showDeleteDialog) {
      try {
        setIsDeleting(true);
        await deleteApiKey({ apiKeyId });
        toast({
          title: "API Key deleted successfully",
        });
        setIsDeleting(false);
        onOpenChange(false);
      } catch (error) {
        setIsDeleting(false);
        toast({
          title: "Failed to delete API Key",
        });
      }
    }
  };
  const disabled = isDeleting || !apiKey?.apiKey || apiKey?.apiKey === form.getValues("apiKeyValue") || !form.getValues("apiKeyName");
  const handleUpdateApiKey = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateApiKey({
        apiKeyId,
        value: values.apiKeyValue || apiKey?.apiKey || "",
        isServer: values.isServer,
        name: values.apiKeyName || apiKey?.name || ""
      });
      toast({
        title: "API Key updated successfully",
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to update API Key",
      });
    }
  };

  const content = (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateApiKey)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="apiKeyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  API Key Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={apiKey?.name || "enter new API key name"}
                    className="mt-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apiKeyValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">API Key</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={apiKey?.apiKey || "enter new API key value"}
                    className="mt-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isServer"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between space-x-2">
                  <FormLabel className="text-sm font-medium">
                    Server Key
                  </FormLabel>
                  <div className="flex items-center space-x-2 ml-auto">
                    <SwitchTooltip />
                    <FormControl>
                      <Switch
                        defaultChecked={!apiKey?.isServer}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-4 cursor-pointer" disabled={isDeleting || !apiKey?.apiKey || apiKey?.apiKey === form.getValues("apiKeyValue")}>
            Update API Key
          </Button>
        </form>
      </Form>
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Danger Zone</AlertTitle>
        <AlertDescription>
          Deleting <span className="font-bold text-black dark:text-white">{apiKeyName}</span> API Key will permanently remove it.
          <div className="mt-3 flex justify-end items-end">
            <Button
              variant="destructive"
              onClick={handleDeleteApiKey}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete API Key"}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      <DeleteApiKeyDialog
        deleteApiKey={showDeleteDialog}
        setDeleteApiKey={setShowDeleteDialog}
        onDeleteApiKey={handleDeleteApiKey}
      />
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit API Key</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">{content}</div>
          <DrawerFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit API Key
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function SwitchTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="w-4 h-4 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm max-w-[200px]">
            Server API Keys are accessible only on server-side. If not set, it
            will be used as a client-side key.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DeleteApiKeyDialog({ deleteApiKey, setDeleteApiKey, onDeleteApiKey }: { deleteApiKey: boolean, setDeleteApiKey: (deleteApiKey: boolean) => void, onDeleteApiKey: () => void }) {
  return (
    <Dialog open={deleteApiKey} onOpenChange={setDeleteApiKey}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this API Key?</p>
        <Button variant="destructive" onClick={onDeleteApiKey}>Confirm Delete</Button>
        <Button variant="outline" onClick={() => setDeleteApiKey(false)}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}




