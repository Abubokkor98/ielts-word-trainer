'use client';

import { PageLoadingFallback, ResetPasswordForm } from '@ielts/ui';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <ResetPasswordForm description="Enter your new admin password" apiPrefix="/admin/password" />
    </Suspense>
  );
}
