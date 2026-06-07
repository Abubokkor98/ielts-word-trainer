import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@ielts/ui';
import { useState } from 'react';
import type { UpdateProfileRequest, UserProfile } from '../types';
import { ProfileAvatarUpload } from './profile-avatar-upload';

interface UpdateProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: UpdateProfileRequest) => void;
  isLoading: boolean;
  onDeletePicture?: () => void;
  isDeletingPicture?: boolean;
}

export function UpdateProfileForm({ 
  profile, 
  onUpdate, 
  isLoading,
  onDeletePicture,
  isDeletingPicture 
}: UpdateProfileFormProps) {
  const [name, setName] = useState(profile.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name });
  };

  const handleUploadSuccess = (url: string, publicId: string) => {
    onUpdate({ profilePictureUrl: url, profilePictureId: publicId });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Update Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <Label className="text-sm font-medium text-muted-foreground mb-4 block">
            Profile Picture
          </Label>
          <ProfileAvatarUpload
            currentImageUrl={profile.profilePictureUrl}
            userName={profile.name}
            onUploadSuccess={handleUploadSuccess}
            onDelete={() => onDeletePicture?.()}
            isDeleting={isDeletingPicture}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName" className="text-sm font-medium text-muted-foreground">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-background text-foreground border-input focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
