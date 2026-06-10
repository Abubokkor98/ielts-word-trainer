'use client';

import { Tabs, TabsContent } from '@ielts/ui';
import { SETTINGS_SECTIONS } from './constants/settings-sections';
import { PasswordSection } from './components/password-section';
import { ProfileDetailsSection } from './components/profile-details-section';
import { ProfileErrorState } from './components/profile-error-state';
import { ProfileHeroCard } from './components/profile-hero-card';
import { ProfileSkeleton } from './components/profile-skeleton';
import { SecuritySection } from './components/security-section';
import { SettingsSidebar } from './components/settings-sidebar';
import { SettingsMobileTabs } from './components/settings-mobile-tabs';
import { useProfile } from './hooks/use-profile';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_TAB = 'profile';

// ============================================================================
// Component
// ============================================================================

export function ProfileContainer() {
  const {
    profile,
    isLoading,
    isError,
    updateProfile,
    isUpdatingProfile,
    changePassword,
    isChangingPassword,
    deleteProfilePicture,
    isDeletingProfilePicture,
  } = useProfile();

  const handleUploadSuccess = (url: string, publicId: string) => {
    updateProfile({ profilePictureUrl: url, profilePictureId: publicId });
  };

  return (
    <main className="bg-background py-8 w-full min-h-[80vh]">
      <div className="container mx-auto px-6 max-w-5xl">
        {isLoading ? (
          <ProfileSkeleton />
        ) : isError || !profile ? (
          <ProfileErrorState />
        ) : (
          <Tabs defaultValue={DEFAULT_TAB}>
            {/* Mobile-only Header (desktop header is in SettingsSidebar) */}
            <header className="lg:hidden mb-4">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Account Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your profile and preferences
              </p>
            </header>

            {/* Mobile Tabs (visible only on < lg) */}
            <div className="lg:hidden mb-6">
              <SettingsMobileTabs sections={SETTINGS_SECTIONS} />
            </div>

            {/* Sidebar + Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Desktop Sidebar — sticky with header inside */}
              <SettingsSidebar sections={SETTINGS_SECTIONS} />

              {/* Content Panels */}
              <div className="flex-1 min-w-0 w-full">
                <TabsContent
                  value="profile"
                  className="mt-0 w-full flex flex-col gap-6 animate-in fade-in duration-200"
                >
                  <ProfileHeroCard
                    profile={profile}
                    onUploadSuccess={handleUploadSuccess}
                    onDeletePicture={() => deleteProfilePicture()}
                    isDeletingPicture={isDeletingProfilePicture}
                  />
                  <ProfileDetailsSection
                    profile={profile}
                    onUpdate={updateProfile}
                    isLoading={isUpdatingProfile}
                  />
                </TabsContent>

                <TabsContent
                  value="security"
                  className="mt-0 w-full animate-in fade-in duration-200"
                >
                  <SecuritySection email={profile.email} />
                </TabsContent>

                <TabsContent
                  value="password"
                  className="mt-0 w-full animate-in fade-in duration-200"
                >
                  <PasswordSection
                    onChangePassword={changePassword}
                    isLoading={isChangingPassword}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        )}
      </div>
    </main>
  );
}
