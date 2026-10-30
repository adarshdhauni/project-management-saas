import { CalendarDays, Camera, Mail, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import EditProfileDialog from "@/features/user/components/EditProfileDialog";
import AvatarCropDialog from "@/features/user/components/AvatarCropDialog";
import RemoveAvatarDialog from "@/features/user/components/RemoveAvatarDialog";
import { useUploadAvatarMutation } from "@/features/user/userApi";
import { setCredentials } from "@/features/auth/authSlice";
import getUserInitials from "@/utils/userInitials";
import createCroppedImage from "@/utils/cropImage";
import { toast } from "@/components/ui/toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState("");
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const [uploadAvatar] = useUploadAvatarMutation();

  const initials = getUserInitials(user?.name);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "—";

  useEffect(() => {
    return () => {
      if (sourceImage) {
        URL.revokeObjectURL(sourceImage);
      }
    };
  }, [sourceImage]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.add({
        type: "error",
        description: "Choose a JPEG, PNG, or WebP image.",
        priority: "high",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.add({
        type: "error",
        description: "The image must not exceed 2 MB.",
        priority: "high",
      });
      return;
    }

    setSourceImage(URL.createObjectURL(file));
    setIsCropOpen(true);
  };

  const handleCropDialogChange = (open) => {
    setIsCropOpen(open);

    if (!open) {
      setSourceImage("");
    }
  };

  const handleAvatarSave = async (pixels) => {
    if (!sourceImage || !pixels) return;

    const croppedBlob = await createCroppedImage(sourceImage, pixels);

    const formData = new FormData();
    formData.append("avatar", croppedBlob, "avatar.jpg");

    const response = await uploadAvatar(formData).unwrap();
    const updatedUser = response.data;

    if (!updatedUser) {
      throw new Error("The server did not return the updated user.");
    }

    dispatch(setCredentials(updatedUser));

    setIsCropOpen(false);
    setSourceImage("");
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="h-16 w-16 shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name || "User"}'s avatar`}
                  className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground ring-1 ring-border">
                  {initials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {user?.name || "User"}
              </h2>

              <div className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user?.email || "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Choose avatar image"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="mr-2 h-4 w-4" />
                Choose image
              </Button>

              {user?.avatar && (
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer text-destructive hover:text-destructive"
                  onClick={() => setIsRemoveDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove photo
                </Button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditProfileOpen(true)}
              className="w-full sm:w-auto cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Edit profile
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold">Personal information</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your basic account information.
          </p>
        </div>

        <div className="divide-y divide-border">
          <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">Full name</p>
              <p className="mt-0.5 wrap-break-word text-sm text-muted-foreground">
                {user?.name || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Email address</p>
              <p className="mt-0.5 break-all text-sm text-muted-foreground">
                {user?.email || "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold">Account</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Information about your TaskFlow account.
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Member since</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {memberSince}
            </p>
          </div>
        </div>
      </section>

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        user={user}
      />

      <AvatarCropDialog
        open={isCropOpen}
        onOpenChange={handleCropDialogChange}
        image={sourceImage}
        onConfirm={handleAvatarSave}
      />

      <RemoveAvatarDialog
        isRemoveDialogOpen={isRemoveDialogOpen}
        setIsRemoveDialogOpen={setIsRemoveDialogOpen}
      />
    </div>
  );
};

export default Profile;
