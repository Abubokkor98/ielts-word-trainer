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
      <DialogContent className="bg-[#1b1722] border-[#2f293a] text-[#f4f4f5] max-w-md shadow-2xl rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#a855f7]">Crop your picture</DialogTitle>
          <DialogDescription className="text-sm text-[#a1a1aa]">
            Drag and zoom to perfectly frame your face.
          </DialogDescription>
        </DialogHeader>

        {imageSrc && (
          <div className="relative w-full h-64 mt-4 bg-black/50 rounded-md overflow-hidden">
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

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isUploading || !croppedAreaPixels}
            className="bg-[#a855f7] hover:bg-[#a855f7]/80 text-white"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUploading ? 'Uploading...' : 'Save Picture'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
