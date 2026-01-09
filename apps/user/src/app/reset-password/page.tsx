'use client';

import { Suspense } from 'react';
import { ResetPasswordForm } from '@ielts/ui';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
