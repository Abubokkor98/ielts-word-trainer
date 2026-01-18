# Environment Configuration for Production

## Backend Environment Variables

### For Separate Vercel Domains (Current Setup)

If your apps are on separate Vercel domains like:

- Backend: `ielts-vocabs-backend.vercel.app`
- User: `ielts-vocabs-user.vercel.app`
- Admin: `ielts-vocabs-admin.vercel.app`

**DO NOT set `COOKIE_DOMAIN`** - leave it undefined. Add these to your backend production environment (Vercel):

```env
# CORS Origins - MUST match frontend URLs exactly (including protocol)
CORS_ORIGINS=https://ielts-vocabs-user.vercel.app,https://ielts-vocabs-admin.vercel.app

# Client URLs
CLIENT_URL=https://ielts-vocabs-user.vercel.app
ADMIN_URL=https://ielts-vocabs-admin.vercel.app

# DO NOT SET COOKIE_DOMAIN - let it default to backend domain
# COOKIE_DOMAIN should be undefined for separate Vercel domains

# Other required variables (already configured)
# MONGODB_URI=...
# JWT_SECRET=...
# NODE_ENV=production
```

### For Custom Domain (Recommended for Production)

If you use a custom domain with subdomains like:

- Backend: `api.yourdomain.com`
- User: `app.yourdomain.com` or `yourdomain.com`
- Admin: `admin.yourdomain.com`

Then set the cookie domain:

```env
# Cookie Domain Configuration
COOKIE_DOMAIN=.yourdomain.com

# CORS Origins
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com

# Client URLs
CLIENT_URL=https://app.yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

## Frontend Environment Variables

Verify the following in your frontend production environment (Vercel):

```env
# API URL - MUST include /api/v1 suffix
NEXT_PUBLIC_API_URL=https://ielts-vocabs-backend.vercel.app/api/v1
```

## Important Notes

### Cookie Domain Behavior

**For Separate Vercel Domains** (e.g., `backend.vercel.app`, `user.vercel.app`, `admin.vercel.app`):

- **DO NOT set `COOKIE_DOMAIN`** environment variable
- Cookies will be set for the exact backend domain
- This works with `sameSite: 'none'` and `secure: true` for cross-origin requests
- Browser will send cookies from `user.vercel.app` to `backend.vercel.app` because of CORS + credentials
- ⚠️ **Vercel does not allow `.vercel.app` as a cookie domain** for security reasons

**For Custom Domain** (e.g., `api.yourdomain.com`, `app.yourdomain.com`):

- Set `COOKIE_DOMAIN=.yourdomain.com` (note the leading dot)
- The leading dot (.) is CRITICAL for subdomain support
- Allows cookies to work across all subdomains
- More secure and professional for production

### CORS Origins

- Must include HTTPS protocol in production
- Must match exact frontend URLs (both user and admin)
- Separate multiple origins with commas (no spaces)
- Example: `https://user.vercel.app,https://admin.vercel.app`

### Cookie Attributes in Production

With separate Vercel domains, cookies will have:

- `domain`: `ielts-vocabs-backend.vercel.app` (exact backend domain)
- `path`: `/`
- `sameSite`: `None` (required for cross-origin)
- `secure`: `true` (required for HTTPS)
- `httpOnly`: `true` (security)

This configuration works because:

1. Backend sets cookies for its own domain
2. Browser stores cookies for backend domain
3. When frontend makes requests to backend with `credentials: true`, browser sends the cookies
4. CORS allows the cross-origin request

## Deployment Checklist

- [ ] Add `COOKIE_DOMAIN` to backend environment variables
- [ ] Verify `CORS_ORIGINS` matches frontend URL exactly
- [ ] Verify `NEXT_PUBLIC_API_URL` in frontend environment
- [ ] Deploy backend changes
- [ ] Deploy frontend changes
- [ ] Test login flow in production
- [ ] Test private route access
- [ ] Test token refresh (wait 16 minutes or manually expire)
