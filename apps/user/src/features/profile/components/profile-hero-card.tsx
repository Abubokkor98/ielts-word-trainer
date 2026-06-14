'use client';

import {
  Card,
  CardContent,
  Badge,
} from '@ielts/ui';
import type { UserProfile } from '../types';
import { ProfileAvatarUpload } from './profile-avatar-upload';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@ielts/auth';

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
  const user = useAuthStore((state) => state.user);
  const isEmailVerified = profile.isEmailVerified || user?.isEmailVerified === true;

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
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-bold text-foreground truncate tracking-tight">
                {profile.name}
              </h2>
              {isEmailVerified ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 font-medium px-2.5 py-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1.5 font-medium px-2.5 py-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Unverified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {profile.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
