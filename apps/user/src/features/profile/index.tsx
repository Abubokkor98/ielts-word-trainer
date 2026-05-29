'use client';

import { ChangePasswordForm } from './components/change-password-form';
import { ProfileErrorState } from './components/profile-error-state';
import { ProfileInfoCard } from './components/profile-info-card';
import { ProfileSkeleton } from './components/profile-skeleton';
import { UpdateProfileForm } from './components/update-profile-form';
import { useProfile } from './hooks/use-profile';

export function ProfileContainer() {
  const {
    profile,
    isLoading,
    isError,
    updateProfile,
    isUpdatingProfile,
    changePassword,
    isChangingPassword,
  } = useProfile();

  return (
    <main className="bg-background py-8 w-full min-h-[80vh]">
      <div className="container mx-auto px-4 max-w-6xl">
        {isLoading ? (
          <ProfileSkeleton />
        ) : isError || !profile ? (
          <ProfileErrorState />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <header>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Account Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your profile and preferences
              </p>
            </header>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <section className="flex flex-col gap-6" aria-label="Profile Info and Update">
                <ProfileInfoCard profile={profile} />
                <UpdateProfileForm
                  profile={profile}
                  onUpdate={updateProfile}
                  isLoading={isUpdatingProfile}
                />
              </section>

              {/* Right Column */}
              <section className="flex flex-col gap-6" aria-label="Security Settings">
                <ChangePasswordForm
                  onChangePassword={changePassword}
                  isLoading={isChangingPassword}
                />
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
