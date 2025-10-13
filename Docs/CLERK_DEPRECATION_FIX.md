# Clerk Deprecation Warning Fix

## Issue

Clerk was showing a deprecation warning:

```
DEPRECATION WARNING: "clerkClient singleton" is deprecated and will be removed in the next major release.
Use `clerkClient()` as a function instead.
```

## Root Cause

Using the deprecated `clerkClient` singleton pattern instead of calling it as a function.

### Old Pattern (Deprecated)

```typescript
import { clerkClient } from "@clerk/nextjs/server";

const user = await clerkClient.users.getUser(userId);
```

### New Pattern (Correct)

```typescript
import { clerkClient } from "@clerk/nextjs/server";

const client = clerkClient();
const user = await client.users.getUser(userId);
```

## Files Fixed

### 1. `/src/lib/messageActions.ts`

**Location:** Line 11 in `getUserInfo()` function

**Before:**

```typescript
async function getUserInfo(userId: string) {
	try {
		const user = await clerkClient.users.getUser(userId);
		const role = (user.publicMetadata as { role?: string })?.role;
		// ...
	}
}
```

**After:**

```typescript
async function getUserInfo(userId: string) {
	try {
		const client = clerkClient();
		const user = await client.users.getUser(userId);
		const role = (user.publicMetadata as { role?: string })?.role;
		// ...
	}
}
```

### 2. `/src/app/api/admin/test-notification/route.ts`

**Location:** Line 28-29 in POST handler

**Before:**

```typescript
const { clerkClient } = await import("@clerk/nextjs/server");
const user = await clerkClient.users.getUser(userId);
const adminEmail = user.emailAddresses[0]?.emailAddress;
```

**After:**

```typescript
const { clerkClient } = await import("@clerk/nextjs/server");
const client = clerkClient();
const user = await client.users.getUser(userId);
const adminEmail = user.emailAddresses[0]?.emailAddress;
```

## Files Already Using Correct Pattern

The following files were already using the correct function call pattern:

### `/src/lib/actions.ts`

Multiple locations using `clerkClient()` as a function:

```typescript
const user = await clerkClient().users.createUser({ ... });
const user = await clerkClient().users.updateUser(data.id, { ... });
await clerkClient().users.deleteUser(id);
```

### `/src/lib/notificationActions.ts`

Multiple locations already using correct pattern:

```typescript
const { clerkClient } = await import("@clerk/nextjs/server");
const client = clerkClient();
const user = await client.users.getUser(userId);
```

## Verification

After the fix, no deprecation warnings should appear in the console. All Clerk client instances are now created using the function call pattern.

### Test Commands

```bash
npm run build  # Should complete without deprecation warnings
npm run dev    # Should start without deprecation warnings
```

## Impact

- ✅ No breaking changes
- ✅ Maintains all existing functionality
- ✅ Prepares codebase for next major Clerk version
- ✅ Eliminates deprecation warnings
- ✅ Future-proof implementation

## Migration Guide for Future Code

When using Clerk client in new code:

### ✅ DO THIS:

```typescript
import { clerkClient } from "@clerk/nextjs/server";

// Create client instance
const client = clerkClient();

// Use the instance
const user = await client.users.getUser(userId);
const users = await client.users.getUserList();
await client.users.updateUser(id, data);
```

### ❌ DON'T DO THIS:

```typescript
import { clerkClient } from "@clerk/nextjs/server";

// Don't use as singleton
const user = await clerkClient.users.getUser(userId);
```

## Additional Notes

- This change aligns with Clerk's recommended practices
- The function call pattern allows for better resource management
- No changes needed to authentication logic or other Clerk features
- Import statement remains the same, only usage changes

## References

- [Clerk Migration Guide](https://clerk.com/docs/upgrade-guides)
- Clerk Next.js SDK Documentation
