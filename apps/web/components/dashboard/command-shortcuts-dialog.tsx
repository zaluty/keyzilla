import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"; // Importing Table components

interface CommandShortcutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandShorcutsDialog({
  isOpen,
  onOpenChange,
}: CommandShortcutProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Command Shortcuts</DialogTitle>
        </DialogHeader>
        {/* New Table for displaying shortcuts */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shortcut</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ctrl || options + K</TableCell>
              <TableCell>Open Command Palette</TableCell>
            </TableRow>
             
            {/* Add more shortcuts as needed */}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}