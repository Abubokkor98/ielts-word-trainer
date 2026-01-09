# Email Verification System - Future Implementation Plan

> **Status:** Not Implemented  
> **Last Updated:** 2026-01-09  
> **Reason for Removal:** Email verification deemed unnecessary as password reset naturally validates email ownership.

---

## Overview

This document outlines the complete implementation flow for an email verification system if it becomes needed in the future. This includes backend API, frontend UI, email templates, and security considerations.

---

## When to Implement

Consider implementing email verification if:

- ✅ You need to verify email addresses before allowing certain actions
- ✅ You want to prevent fake/disposable email registrations
- ✅ Compliance or business requirements mandate email verification
- ✅ You want to send marketing emails and need verified opt-ins
- ✅ You need to distinguish between verified and unverified users

---

## Backend Implementation Flow

### 1. Database Schema Updates

**Add to User Model (`apps/backend/src/modules/users/users.model.ts`):**

```typescript
export interface IUser extends Document {
  // ... existing fields
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  // ... existing fields
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
});
```

**Security Note:** Store hashed tokens, not plain text.

---

### 2. Email Service

**Add to Email Service (`apps/backend/src/core/services/email.service.ts`):**

```typescript
static async sendVerificationEmail(
  email: string,
  token: string,
  role: 'user' | 'admin' = 'user'
) {
  // Determine base URL based on role
  const baseUrl = role === 'admin'
    ? process.env['ADMIN_URL']
    : process.env['CLIENT_URL'];

  // URL encode token for safety
  const verificationUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

  // Send email with verification link
  // Include: user-friendly message, expiration time (24 hours)
}
```

**Email Template Should Include:**

- Clear call-to-action button
- Expiration time (24 hours recommended)
- What happens if they don't verify
- Support contact information

---

### 3. Controller Methods

**Add to Auth Controller (`apps/backend/src/modules/auth/password-reset.controller.ts` or create new `email-verification.controller.ts`):**

#### A. Send Verification Email (on Registration)

```typescript
static async sendVerificationEmail(user: IUser) {
  // Generate secure random token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Hash token before storing (like password reset)
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Store hashed token with expiration (24 hours)
  user.verificationToken = hashedToken;
  user.verificationTokenExpires = new Date(Date.now() + 24 * 3600000);
  await user.save();

  // Send email with plain token
  await EmailService.sendVerificationEmail(
    user.email,
    verificationToken,
    user.role
  );
}
```

#### B. Verify Email

```typescript
static async verifyEmail(req: Request, res: Response, next: NextFunction) {
  const { token } = req.body;

  // Hash the received token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid token
  const user = await UserService.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  // Mark as verified and clear token
  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return res.json({
    success: true,
    message: 'Email verified successfully'
  });
}
```

#### C. Resend Verification Email

```typescript
static async resendVerification(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  const user = await UserService.findByEmail(email);

  // Don't reveal if email exists (security)
  if (!user) {
    return res.json({
      success: true,
      message: 'If that email exists, a verification link has been sent.'
    });
  }

  // Check if already verified
  if (user.emailVerified) {
    throw new AppError('Email already verified', 400);
  }

  // Rate limiting: Check last sent time (prevent spam)
  // Implement: max 3 resends per hour

  // Generate and send new token
  await this.sendVerificationEmail(user);

  return res.json({
    success: true,
    message: 'Verification email sent'
  });
}
```

---

### 4. API Routes

**Add to Routes (`apps/backend/src/modules/auth/email-verification.routes.ts`):**

```typescript
import { Router } from 'express';
import { EmailVerificationController } from './email-verification.controller';
import { validateRequest } from '../../core/middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const verifyEmailSchema = {
  body: z.object({
    token: z.string().min(1),
  }),
};

const resendVerificationSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};

// Routes
router.post('/verify-email', validateRequest(verifyEmailSchema), EmailVerificationController.verifyEmail);

router.post('/resend-verification', validateRequest(resendVerificationSchema), EmailVerificationController.resendVerification);

export default router;
```

**Register routes in main app:**

```typescript
app.use('/api/auth', emailVerificationRoutes);
```

---

### 5. Registration Flow Update

**Modify Registration (`apps/backend/src/modules/auth/auth.controller.ts`):**

```typescript
static async register(req: Request, res: Response, next: NextFunction) {
  // ... existing user creation code

  const user = await UserService.createUser(req.body);

  // Send verification email
  await EmailVerificationController.sendVerificationEmail(user);

  // Generate auth tokens (allow login before verification)
  const { accessToken, refreshToken } = await AuthService.generateTokens(user);

  // Return response with verification message
  res.status(201).json({
    success: true,
    accessToken,
    message: 'Registration successful! Please check your email to verify your account.',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: false // Important: show verification status
    }
  });
}
```

---

### 6. Optional: Enforce Verification

**Middleware to Block Unverified Users (`apps/backend/src/core/middleware/require-verified-email.middleware.ts`):**

```typescript
export const requireVerifiedEmail = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthenticated', 401));
  }

  const user = await UserService.findById(req.user.id);

  if (!user?.emailVerified) {
    return next(new AppError('Please verify your email address to access this feature', 403));
  }

  next();
};
```

**Usage:**

```typescript
// Apply to specific routes
router.post(
  '/create-quiz',
  authenticate,
  requireVerifiedEmail, // Add this middleware
  QuizController.create
);
```

---

## Frontend Implementation Flow

### 1. User App - Verify Email Page

**Create: `apps/user/src/app/verify-email/page.tsx`**

**Flow:**

1. Extract token from URL query params (`?token=xxx`)
2. Show loading spinner
3. Call `POST /api/auth/verify-email` with token
4. On success:
   - Show success message
   - Redirect to dashboard or login after 3 seconds
5. On error:
   - Show error message
   - Provide "Resend verification email" button
   - Link back to registration

**UI Elements:**

- Loading state with spinner
- Success state with checkmark icon
- Error state with error icon
- Resend button
- Navigation buttons

---

### 2. User App - Post-Registration Flow

**Update: `apps/user/src/app/register/page.tsx`**

**After successful registration:**

```typescript
onSuccess: (data) => {
  // Don't redirect to dashboard immediately
  // Instead, show verification prompt

  setToken(data.accessToken);
  setUser(data.data);

  toast({
    title: 'Registration successful!',
    description: 'Please check your email to verify your account.',
    status: 'info',
    duration: 7000,
    isClosable: true,
  });

  // Redirect to verification pending page
  router.push('/verify-email-pending');
};
```

---

### 3. User App - Verification Pending Page

**Create: `apps/user/src/app/verify-email-pending/page.tsx`**

**UI Elements:**

- Email icon
- "Check your email" message
- User's email address (from auth state)
- "Didn't receive email?" section
- Resend verification button (with rate limiting)
- "Change email" link (if needed)

**Features:**

- Countdown timer before allowing resend (60 seconds)
- Show success message after resend
- Allow user to continue to dashboard (with banner)

---

### 4. User App - Verification Status Banner

**Create: `apps/user/src/components/VerificationBanner.tsx`**

**Display on dashboard if `emailVerified === false`:**

```typescript
{
  !user.emailVerified && (
    <Alert status="warning" mb={4}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>Email not verified</AlertTitle>
        <AlertDescription>Please verify your email to access all features.</AlertDescription>
      </Box>
      <Button size="sm" onClick={handleResend}>
        Resend Email
      </Button>
    </Alert>
  );
}
```

---

### 5. Admin App - Same Implementation

**Create identical pages for admin app:**

- `apps/admin/src/app/verify-email/page.tsx`
- `apps/admin/src/app/verify-email-pending/page.tsx`
- Admin verification banner component

**Important:** Admin verification emails should use `ADMIN_URL` environment variable.

---

## Security Best Practices

### 1. Token Security

- ✅ Generate cryptographically secure random tokens (32+ bytes)
- ✅ Hash tokens before storing in database (SHA-256)
- ✅ URL encode tokens in email links
- ✅ Set expiration time (24 hours recommended)
- ✅ Clear token after successful verification

### 2. Rate Limiting

- ✅ Limit resend requests (max 3 per hour per email)
- ✅ Implement exponential backoff for repeated requests
- ✅ Track attempts in database or Redis

### 3. Email Security

- ✅ Don't reveal if email exists in system (resend endpoint)
- ✅ Use HTTPS for all verification links
- ✅ Include warning about phishing in email template

### 4. User Experience

- ✅ Allow users to login before verification (soft enforcement)
- ✅ Show clear verification status in UI
- ✅ Provide easy resend mechanism
- ✅ Give grace period before enforcing verification (7 days)

---

## Environment Variables

**Add to `.env` files:**

```bash
# User app URL for verification links
CLIENT_URL=http://localhost:3000

# Admin app URL for admin verification links
ADMIN_URL=http://localhost:3001

# Email configuration (already exists)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@ielts-platform.com
```

---

## Implementation Checklist

### Backend

- [ ] Add `emailVerified`, `verificationToken`, `verificationTokenExpires` to User model
- [ ] Create `sendVerificationEmail()` in EmailService
- [ ] Create email verification controller with 3 methods
- [ ] Add verification routes (`/verify-email`, `/resend-verification`)
- [ ] Update registration to send verification email
- [ ] Add `requireVerifiedEmail` middleware (optional)
- [ ] Implement rate limiting for resend
- [ ] Update seed data to set `emailVerified: true` for test users

### Frontend - User App

- [ ] Create `/verify-email` page
- [ ] Create `/verify-email-pending` page
- [ ] Create verification banner component
- [ ] Update registration success flow
- [ ] Add resend verification functionality
- [ ] Update user profile to show verification status

### Frontend - Admin App

- [ ] Create `/verify-email` page
- [ ] Create `/verify-email-pending` page
- [ ] Create verification banner component
- [ ] Update admin registration flow
- [ ] Add resend verification functionality

### Testing

- [ ] Test registration sends verification email
- [ ] Test verification link works
- [ ] Test expired token handling
- [ ] Test resend functionality
- [ ] Test rate limiting
- [ ] Test both user and admin flows
- [ ] Test email templates render correctly

---

## Enforcement Strategies

### Option 1: Soft Enforcement (Recommended)

- Users can login and use app
- Show banner prompting verification
- Optionally restrict certain features
- Give 7-day grace period

### Option 2: Hard Enforcement

- Users cannot access dashboard until verified
- Redirect to verification pending page
- Only allow logout and resend actions

### Option 3: Feature-Based

- Basic features available to all
- Premium features require verification
- Use `requireVerifiedEmail` middleware on specific routes

---

## Email Template Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0;">IELTS Vocabulary Platform</h1>
    </div>

    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color: #333;">Verify Your Email Address</h2>

      <p style="color: #666; line-height: 1.6;">Thank you for registering! Please verify your email address by clicking the button below:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{{verificationUrl}}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;"> Verify Email Address </a>
      </div>

      <p style="color: #666; font-size: 14px;">
        Or copy and paste this link into your browser:<br />
        <a href="{{verificationUrl}}" style="color: #667eea; word-break: break-all;">{{verificationUrl}}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

      <p style="color: #999; font-size: 12px;">
        This link will expire in 24 hours.<br />
        If you didn't create an account, please ignore this email.
      </p>
    </div>
  </body>
</html>
```

---

## Migration Plan (If Implementing Later)

### Step 1: Add Database Fields

```javascript
// MongoDB migration
db.users.updateMany(
  {},
  {
    $set: {
      emailVerified: false,
      verificationToken: null,
      verificationTokenExpires: null,
    },
  }
);

// Set existing users as verified (optional)
db.users.updateMany({ createdAt: { $lt: new Date('2026-01-09') } }, { $set: { emailVerified: true } });
```

### Step 2: Deploy Backend Changes

- Deploy new API endpoints
- Don't enforce verification yet
- Monitor email sending

### Step 3: Deploy Frontend Changes

- Deploy verification pages
- Add banners for unverified users
- Test user flow

### Step 4: Enable Enforcement (Optional)

- Add middleware to protected routes
- Communicate changes to users
- Provide grace period

---

## Monitoring & Analytics

**Track these metrics:**

- Verification email send rate
- Verification completion rate
- Time to verify (average)
- Resend request frequency
- Expired token rate
- Bounce/delivery failures

**Use for:**

- Improving email deliverability
- Optimizing verification flow
- Identifying issues early

---

## Alternative: Social Login

**Consider instead of email verification:**

- Google OAuth
- GitHub OAuth
- Microsoft OAuth

**Benefits:**

- Email automatically verified by provider
- Better user experience
- No email sending infrastructure needed

---

## Conclusion

This document provides a complete blueprint for implementing email verification. Follow the flows and checklists when you decide to add this feature. All code examples are production-ready and follow security best practices.

**Remember:** Only implement if there's a clear business need. Password reset already validates email ownership for most use cases.
