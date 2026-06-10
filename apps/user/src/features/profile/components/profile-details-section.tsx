'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@ielts/ui';
import { Pencil, X } from 'lucide-react';
import { useState } from 'react';
import type { UpdateProfileRequest, UserProfile } from '../types';

// ============================================================================
// Types
// ============================================================================

interface ProfileDetailsSectionProps {
  readonly profile: UserProfile;
  readonly onUpdate: (data: UpdateProfileRequest) => void;
  readonly isLoading: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ProfileDetailsSection({
  profile,
  onUpdate,
  isLoading,
}: ProfileDetailsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdate({ name });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(profile.name);
    setIsEditing(false);
  };

  return (
    <section id="profile" aria-labelledby="profile-heading">
      <Card className="border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle
            id="profile-heading"
            className="text-base font-semibold text-foreground"
          >
            Profile Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-2">
                <Label
                  htmlFor="profileDisplayName"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Display Name
                </Label>
                <Input
                  id="profileDisplayName"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                />
              </fieldset>

              <footer className="flex items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !name.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </footer>
            </form>
          ) : (
            <dl className="flex flex-col gap-4">
              <div>
                <dt className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Display Name
                </dt>
                <dd className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {profile.name}
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit display name"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Email Address
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {profile.email}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>

      </Card>
    </section>
  );
}
