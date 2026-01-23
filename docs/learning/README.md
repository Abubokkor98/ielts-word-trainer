# 📚 Security & Performance Learning Resources

This folder contains beginner-friendly explanations of advanced web development concepts used in this project.

## Documents

### 🛡️ [CSRF Protection Explained](./csrf-protection-explained.md)

Learn what CSRF attacks are, how they work, and how your app protects against them.

**Topics covered:**

- What is CSRF? (with real-world analogies)
- How CSRF protection works
- Why browsers alone can't protect you
- Visual flow diagrams
- Code examples from this project
- Testing your CSRF implementation

**Recommended for:** Understanding why logout and refresh endpoints need extra security.

---

### 📦 [HTTP Cache-Control Explained](./http-cache-explained.md)

Learn how HTTP caching works and why different endpoints have different cache durations.

**Topics covered:**

- What is HTTP caching? (with library analogy)
- How Cache-Control headers work
- Why different endpoints need different cache times
- The difference between browser cache and CDN cache
- How React Query and HTTP cache work together
- Visual flow diagrams
- Code examples from this project

**Recommended for:** Understanding why your SRS stats update correctly after studying words.

---

## How to Use These Documents

1. **Start with concepts:** Read the "What is..." sections to understand the basics
2. **Study the analogies:** Real-world examples help you remember
3. **Review the code:** See how concepts apply to this actual project
4. **Follow the diagrams:** Visual flows show step-by-step processes
5. **Test it yourself:** Each document has practical testing instructions

---

## Learning Path

**If you're new to web security:**

1. Start with → [CSRF Protection Explained](./csrf-protection-explained.md)
2. Understand why cookies alone aren't secure
3. Learn how tokens provide extra security

**If you're wondering about performance:**

1. Start with → [HTTP Cache-Control Explained](./http-cache-explained.md)
2. Understand how caching speeds up your app
3. Learn why different data needs different cache durations

---

## Reference Implementation

All examples in these documents are taken from the actual code in this project:

**CSRF Implementation:**

- [`apps/backend/src/shared/csrf.ts`](../../apps/backend/src/shared/csrf.ts)
- [`apps/backend/src/modules/auth/auth.controller.ts`](../../apps/backend/src/modules/auth/auth.controller.ts)
- [`apps/backend/src/modules/auth/auth.routes.ts`](../../apps/backend/src/modules/auth/auth.routes.ts)

**Cache Implementation:**

- [`apps/backend/src/server.ts`](../../apps/backend/src/server.ts)
- [`apps/user/src/features/dashboard/hooks/use-dashboard-data.ts`](../../apps/user/src/features/dashboard/hooks/use-dashboard-data.ts)

---

## Additional Resources

### Official Documentation

- [MDN: CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)
- [MDN: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [OWASP: Cross-Site Request Forgery](https://owasp.org/www-community/attacks/csrf)

### Testing Tools

- Browser DevTools → Network tab (see cache headers)
- Browser DevTools → Application tab (inspect cookies)
- Browser DevTools → Console (test CSRF protection)

---

## Questions?

If something is unclear:

1. Check the test sections in each document
2. Review the code examples
3. Try the practical tests yourself
4. Open DevTools and observe the behavior

Remember: The best way to learn is by doing. Follow the testing instructions and see these concepts in action! 🚀
