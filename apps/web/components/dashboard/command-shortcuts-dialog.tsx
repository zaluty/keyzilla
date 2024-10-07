import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Keyboard Shortcut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Copy</td>
              <td>Ctrl + C</td>
            </tr>
            <tr>
              <td>Paste</td>
              <td>Ctrl + V</td>
            </tr>
            <tr>
              <td>Undo</td>
              <td>Ctrl + Z</td>
            </tr>
            <tr>
              <td>Redo</td>
              <td>Ctrl + Y</td>
            </tr>
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
