# User-Admin Architecture Separation: Comprehensive Documentation

## 1. Overview

This document details the architectural refactoring of the IELTS Vocabulary application, specifically the separation of the `User` and `Admin` entities into distinct models. This change improves security, scalability, and maintainability.

## 2. Before Implementation (Legacy Architecture)

### 2.1. Single User Model

- **Structure**: A single MongoDB collection (`users`) stored both regular end-users and administrators.
- **Differentiation**: A `role` field in the `User` schema (`user` vs `admin`) was the only differentiator.
- **Fields**: The `User` model contained fields irrelevant to admins (e.g., `xp`, `streak`, `learningStats`) and potentially sensitive admin fields mixed with user data.

### 2.2. Authentication

- **Unified Endpoint**: Both users and admins logged in via the same `/auth/login` endpoint.
- **Access Control**: Frontend logic determined redirection based on the returned role. This meant a user login vulnerability could potentially expose admin login vectors.

### 2.3. Limitations

- **Security**: If a regular user account was compromised or if there was an injection vulnerability, it could theoretically be escalated to an admin role more easily since they shared the same table/collection.
- **Data Integrity**: Admin accounts had empty/unused fields meant for language learning (XP, streaks), polluting the database.
- **Scalability**: Adding admin-specific features (like specific permissions or audit logs) would clutter the User model.

---

## 3. After Implementation (New Architecture)

### 3.1. Separate User and Admin Models

- **User Model**: Strictly for end-users. Contains `xp`, `streak`, `progress`, etc.
- **Admin Model**: A new, dedicated `Admin` model (Collection: `admins`).
  - **Fields**: `name`, `email`, `passwordHash`, `role` (`SUPER_ADMIN`, `ADMIN`), `resetPasswordToken`, `resetPasswordExpires`.
  - **No Bloat**: Removed all language-learning specific fields.

### 3.2. Distinct Authentication Flows

- **User Auth**: `/api/v1/auth/login` (Unchanged for end-users).
- **Admin Auth**: `/api/v1/admin/login` (New, dedicated endpoint).
  - **Isolation**: Admin login attempts are completely isolated from user traffic.
  - **Middleware**: `authenticate` and `authorize` middleware updated to support dual contexts (`User` or `Admin`).

### 3.3. Role-Based Access Control (RBAC)

- **Roles**:
  - `UserRole.USER`: Standard app user.
  - `AdminRole.ADMIN`: Can view/manage content (Videos, Words, Quizzes).
  - `AdminRole.SUPER_ADMIN`: Administrative control. Can Create/Delete other Admins and ban users.
- **Shared Access**: Routes like `words`, `topics`, and `quiz` explicitly authorize both `ADMIN` and `SUPER_ADMIN`.

### 3.4. Frontend Updates

- **Admin Portal**: Now strictly requires an account from the `admins` collection.
- **User Portal**: Remains compatible with the `User` model.
- **Management UI**: Added a specific "Admins" page in the dashboard for Super Admins to manage staff.

---

## 4. Why This Approach is Superior

1.  **Enhanced Security (Separation of Privilege)**:

    - Even if the User database is leaked, Admin credentials remain secure in a separate collection.
    - Admin endpoints (`/admin/*`) can be firewalled or rate-limited differently from public user endpoints.

2.  **Clean Code & Separation of Concerns**:

    - The `User` model now strictly focuses on "Learning Domain" logic.
    - The `Admin` model focuses on "System Management" logic.
    - Developers don't need to add `?optional` flags for fields that only apply to one group.

3.  **Future-Proofing**:
    - We can now add complex Admin features (e.g., Two-Factor Authentication, Audit Logs, specific permission sets) without touching the User code.
    - We can scale the User database (millions of rows) without impacting the performance of Admin queries (dozens of rows).

---

## 5. Impact Analysis & Verification

### 5.1. Impact on Existing Functionality

- **User App**: **Zero Negative Impact**. The User model interface remains backward compatible (minus the removed 'admin' role option). User login and registration work exactly as before.
- **Admin App**: **Significant Update**. Admins must now log in via the updated login page. Old admin accounts in the `users` collection are obsolete and replaced by new accounts in the `admins` collection.

### 5.2. Verification Steps Performed

- [x] **Database Seeding**: Verified `pnpm db:seed` creates distinct User and Admin entries.
- [x] **Admin Login**: Confirmed `/api/v1/admin/login` successfully issues tokens for `Admin` entities.
- [x] **Route Protection**: Confirmed `/admin/admins` allows read access to Admins, but modification (Create/Delete) is restricted to Super Admins.
- [x] **Content Management**: Confirmed `words`, `topics`, and `quiz` routes accept tokens from both `ADMIN` and `SUPER_ADMIN` roles.
- [x] **Type Safety**: Resolved all TypeScript errors regarding `UserRole` vs `AdminRole` in middleware.

### 5.3. Potential Risks & Mitigations

- **Risk**: Stale tokens from the old system.
  - **Mitigation**: Since the underlying model ID lookup changes (User vs Admin), old tokens for admins will simply fail to validate, forcing a re-login. This is secure fail-safe behavior.
- **Risk**: hardcoded `UserRole.ADMIN` checks in future code.
  - **Mitigation**: Removed `ADMIN` from `UserRole` enum entirely. The compiler will now error if a developer tries to use `UserRole.ADMIN`, forcing them to use `AdminRole`.

## 6. Conclusion

The refactor was applied successfully. The system now adheres to industry best practices for separating customer data from administrative control. All known bugs (including the specific TypeScript import issue) have been resolved.
