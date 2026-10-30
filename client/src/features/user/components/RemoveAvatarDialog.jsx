import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

import { useRemoveAvatarMutation } from "../userApi";
import { setCredentials } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

const RemoveAvatarDialog = ({ isRemoveDialogOpen, setIsRemoveDialogOpen }) => {
  const dispatch = useDispatch();

  const [removeAvatar, { isLoading: isRemoving }] = useRemoveAvatarMutation();

  const handleRemoveAvatar = async () => {
    try {
      const response = await removeAvatar().unwrap();
      const updatedUser = response.data;

      if (!updatedUser) {
        throw new Error("The server did not return the updated user.");
      }

      dispatch(setCredentials(updatedUser));

      toast.add({
        type: "success",
        title: "Profile photo removed",
        description: "Your profile photo was removed successfully.",
      });

      setIsRemoveDialogOpen(false);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
        priority: "high",
      });
    }
  };

  return (
    <Dialog
      open={isRemoveDialogOpen}
      onOpenChange={(open) => {
        if (!isRemoving) setIsRemoveDialogOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove profile photo?</DialogTitle>

          <DialogDescription>
            Your profile photo will be removed and replaced with your initials.
            You can upload a new photo anytime. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsRemoveDialogOpen(false)}
            disabled={isRemoving}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleRemoveAvatar}
            disabled={isRemoving}
            className="cursor-pointer"
          >
            {isRemoving ? (
              <>
                <Spinner data-icon="inline-start" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 data-icon="inline-start" />
                Remove photo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveAvatarDialog;
