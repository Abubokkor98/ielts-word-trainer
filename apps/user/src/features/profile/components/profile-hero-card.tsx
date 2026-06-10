'use client';

import {
  Card,
  CardContent,
} from '@ielts/ui';
import type { UserProfile } from '../types';
import { ProfileAvatarUpload } from './profile-avatar-upload';

// ============================================================================
// Types
// ============================================================================

interface ProfileHeroCardProps {
  readonly profile: UserProfile;
  readonly onUploadSuccess: (url: string, publicId: string) => void;
  readonly onDeletePicture: () => void;
  readonly isDeletingPicture?: boolean;
}


// ============================================================================
// Component
// ============================================================================

export function ProfileHeroCard({
  profile,
  onUploadSuccess,
  onDeletePicture,
  isDeletingPicture,
}: ProfileHeroCardProps) {
  return (
    <Card className="border-[var(--glass-border)] bg-card/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with integrated upload overlay */}
          <ProfileAvatarUpload
            currentImageUrl={profile.profilePictureUrl}
            userName={profile.name}
            onUploadSuccess={onUploadSuccess}
            onDelete={onDeletePicture}
            isDeleting={isDeletingPicture}
          />

          {/* Identity Info */}
          <div className="flex flex-col items-center sm:items-start gap-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {profile.name}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {profile.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
