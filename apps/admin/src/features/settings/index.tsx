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

      <div className="flex border-b border-border mb-6">
        <Button
          type="button"
          variant="ghost"
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
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <ProfileForm />
            </CardContent>
          </Card>
        )}
        {activeTab === 'security' && (
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <SecurityForm />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

