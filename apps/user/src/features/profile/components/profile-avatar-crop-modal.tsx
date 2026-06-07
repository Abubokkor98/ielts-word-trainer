import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { Loader2 } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@ielts/ui';
import getCroppedImg from '../utils/cropImage';

interface ProfileAvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  isUploading: boolean;
  onClose: () => void;
  onConfirm: (croppedImageFile: File) => void;
}

export function ProfileAvatarCropModal({
  isOpen,
  imageSrc,
  isUploading,
  onClose,
  onConfirm,
}: ProfileAvatarCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, currentCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedImageFile) {
        onConfirm(croppedImageFile);
      }
    } catch (error) {
      console.error('Error cropping image', error);
      alert('Failed to crop image');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isUploading && !open && onClose()}>
      <DialogContent className="bg-card border-border text-foreground w-[92vw] max-w-md sm:w-full shadow-2xl rounded-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-brand">Crop your picture</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Drag and zoom to perfectly frame your face.
          </DialogDescription>
        </DialogHeader>

        {imageSrc && (
          <div className="relative w-full h-48 sm:h-64 mt-3 sm:mt-4 bg-black/50 rounded-md overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}

        <DialogFooter className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isUploading || !croppedAreaPixels}
            className="bg-brand hover:bg-brand/90 text-white w-full sm:w-auto"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUploading ? 'Uploading...' : 'Save Picture'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
