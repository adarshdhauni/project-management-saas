import Cropper from "react-easy-crop";
import { useEffect, useState } from "react";
import { LoaderCircle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.05;

const clampZoom = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return MIN_ZOOM;
  }

  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, numericValue));
};

const AvatarCropDialog = ({ open, onOpenChange, image, onConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setCrop({ x: 0, y: 0 });
      setZoom(MIN_ZOOM);
      setCroppedAreaPixels(null);
      setIsSaving(false);
      setError("");
      return;
    }

    if (image) {
      setCrop({ x: 0, y: 0 });
      setZoom(MIN_ZOOM);
      setCroppedAreaPixels(null);
      setError("");
    }
  }, [open, image]);

  const handleZoomChange = (value) => {
    const nextZoom = Number(value);

    if (!Number.isFinite(nextZoom)) return;

    setZoom(clampZoom(nextZoom));
  };

  const handleZoomOut = () => {
    handleZoomChange(Number((zoom - ZOOM_STEP).toFixed(2)));
  };

  const handleZoomIn = () => {
    handleZoomChange(Number((zoom + ZOOM_STEP).toFixed(2)));
  };

  const handleOpenChange = (nextOpen) => {
    if (isSaving) return;
    onOpenChange(nextOpen);
  };

  const handleConfirm = async () => {
    if (!image || !croppedAreaPixels || isSaving) return;

    setError("");
    setIsSaving(true);

    try {
      await onConfirm(croppedAreaPixels);
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Unable to save your profile photo. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md gap-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogHeader className="border-b border-border px-5 py-4 text-left sm:px-6">
          <DialogTitle className="text-base font-semibold">
            Adjust profile photo
          </DialogTitle>

          <DialogDescription className="mt-1 text-sm leading-relaxed">
            Drag to reposition your image. Use the zoom controls to adjust the
            framing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="relative mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-lg bg-muted">
            {image ? (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                aspect={1}
                cropShape="round"
                showGrid={false}
                restrictPosition
                onCropChange={setCrop}
                onZoomChange={handleZoomChange}
                onCropComplete={(_, pixels) => {
                  setCroppedAreaPixels(pixels);
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image selected.
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="avatar-zoom" className="text-sm font-medium">
                Zoom
              </label>

              <span
                className="text-xs tabular-nums text-muted-foreground"
                aria-live="off"
              >
                {zoom.toFixed(2)}×
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 cursor-pointer"
                onClick={handleZoomOut}
                disabled={!image || isSaving || zoom <= MIN_ZOOM}
                aria-label="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <input
                id="avatar-zoom"
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                value={zoom}
                onChange={(event) =>
                  handleZoomChange(event.currentTarget.value)
                }
                disabled={!image || isSaving}
                aria-label="Zoom image"
                aria-valuetext={`${zoom.toFixed(2)} times`}
                className="h-2 min-w-0 flex-1 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 cursor-pointer"
                onClick={handleZoomIn}
                disabled={!image || isSaving || zoom >= MAX_ZOOM}
                aria-label="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Drag the photo to reposition it. The circular area shows how your
              avatar will be framed.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="wrap-break-word rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSaving}
            className="w-full sm:w-auto cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!image || !croppedAreaPixels || isSaving}
            className="w-full sm:w-auto cursor-pointer"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Saving photo...
              </>
            ) : (
              "Save photo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarCropDialog;
