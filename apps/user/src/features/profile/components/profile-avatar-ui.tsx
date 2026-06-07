import { Avatar, AvatarFallback, AvatarImage, Button } from '@ielts/ui';
import { Loader2 } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';

interface ProfileAvatarUIProps {
  currentImageUrl?: string;
  userName: string;
  isUploading: boolean;
  isDeleting?: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
  onDeleteClick: () => void;
}

export function ProfileAvatarUI({
  currentImageUrl,
  userName,
  isUploading,
  isDeleting,
  fileInputRef,
  onFileChange,
  onUploadClick,
  onDeleteClick,
}: ProfileAvatarUIProps) {
  const getInitials = (name: string) =>
    name ? name.charAt(0).toUpperCase() : '?';

  return (
    <>
      <Avatar className="w-24 h-24 text-2xl">
        <AvatarImage
          src={currentImageUrl || undefined}
          alt={userName}
          className="object-cover"
        />
        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={onUploadClick}
          disabled={isUploading || isDeleting}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isUploading ? 'Uploading...' : 'Change Picture'}
        </Button>

        {currentImageUrl && (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDeleteClick}
            disabled={isDeleting || isUploading}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isDeleting ? 'Removing...' : 'Remove Picture'}
          </Button>
        )}
      </div>
    </>
  );
}
