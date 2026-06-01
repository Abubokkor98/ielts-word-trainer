'use client';

import { useState } from 'react';
import { Button, Card, CardContent } from '@ielts/ui';
import { Lock, User } from 'lucide-react';
import { ProfileForm } from './components/ProfileForm';
import { SecurityForm } from './components/SecurityForm';

export function SettingsContainer() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div className="max-w-4xl mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Account Settings
        </h1>
      </header>

      <div className="flex border-b border-border mb-6" role="tablist">
        <Button
          type="button"
          variant="ghost"
          role="tab"
          id="tab-profile"
          aria-selected={activeTab === 'profile'}
          aria-controls="panel-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 rounded-none h-auto font-medium transition-colors hover:bg-transparent ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User size={18} />
          Profile
        </Button>
        <Button
          type="button"
          variant="ghost"
          role="tab"
          id="tab-security"
          aria-selected={activeTab === 'security'}
          aria-controls="panel-security"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 rounded-none h-auto font-medium transition-colors hover:bg-transparent ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lock size={18} />
          Security
        </Button>
      </div>

      <main>
        {activeTab === 'profile' && (
          <div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                <ProfileForm />
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'security' && (
          <div role="tabpanel" id="panel-security" aria-labelledby="tab-security">
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                <SecurityForm />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

