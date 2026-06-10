import { Avatar, AvatarFallback, AvatarImage } from '@ielts/ui';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Helpers
// ============================================================================

function getInitial(name: string): string {
  return name ? name.charAt(0).toUpperCase() : '?';
}

// ============================================================================
// Component
// ============================================================================

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
  const isBusy = isUploading || isDeleting;

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      {/* Avatar with camera overlay */}
      <div className="relative group">
        <Avatar className="h-20 w-20 text-2xl ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          <AvatarImage
            src={currentImageUrl ?? undefined}
            alt={userName}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitial(userName)}
          </AvatarFallback>
        </Avatar>

        {/* Camera overlay — click to upload */}
        <button
          type="button"
          onClick={onUploadClick}
          disabled={isBusy}
          aria-label="Change profile picture"
          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </button>

        {/* Remove badge — only when picture exists */}
        {currentImageUrl && !isUploading && (
          <button
            type="button"
            onClick={onDeleteClick}
            disabled={isBusy}
            aria-label="Remove profile picture"
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-destructive/90 hover:bg-destructive flex items-center justify-center transition-colors duration-200 ring-2 ring-background disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-3 w-3 text-white animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />
    </div>
  );
}
