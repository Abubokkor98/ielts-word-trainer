'use client';

import Clarity from '@microsoft/clarity';
import { useEffect } from 'react';

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY;

/**
 * Initializes Microsoft Clarity analytics.
 * Must be a client component because Clarity requires the browser's window object.
 * Renders nothing — purely a side-effect component.
 */
export function ClarityAnalytics() {
  useEffect(() => {
    if (CLARITY_PROJECT_ID) {
      Clarity.init(CLARITY_PROJECT_ID);
    }
  }, []);

  return null;
}
