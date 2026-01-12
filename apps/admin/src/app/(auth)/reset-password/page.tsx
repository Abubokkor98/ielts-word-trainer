'use client';

import { ResetPasswordForm } from '@ielts/ui';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm description="Enter your new admin password" apiPrefix="/admin/password" />
    </Suspense>
  );
}
