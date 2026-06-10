import { Lock, Shield, User } from 'lucide-react';
import type { ElementType } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface SettingsSection {
  readonly id: string;
  readonly title: string;
  readonly icon: ElementType;
}

// ============================================================================
// Configuration
// ============================================================================

export const SETTINGS_SECTIONS: readonly SettingsSection[] = [
  { id: 'profile', title: 'Profile', icon: User },
  { id: 'security', title: 'Security', icon: Shield },
  { id: 'password', title: 'Password', icon: Lock },
] as const;

export const SETTINGS_SECTION_IDS = SETTINGS_SECTIONS.map(
  (section) => section.id
);
