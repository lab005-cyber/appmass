# User Roles & Permissions

## Role Hierarchy

```
Admin (level 3)
  └── Moderator (level 2)
        └── User (level 1)
              └── Guest (level 0)
```

Higher levels inherit all permissions from lower levels.

---

## Guest (Level 0)

Unauthenticated users browsing public content.

**Permissions:**
- View public profiles (limited fields)
- View public posts
- View public comments
- Create an account (email, OAuth)
- Login

**Restrictions:**
- No content creation
- No likes, comments, or follows
- No messaging
- No story viewing
- Stricter rate limits (20 req/min)

---

## User (Level 1)

Authenticated user with a verified account.

**Permissions:**

| Category | Permissions |
|----------|-------------|
| **Profile** | Read own profile; update own profile; upload avatar |
| **Posts** | Create posts; edit own posts (within 24h); delete own posts; view all public posts |
| **Comments** | Create comments on any post; delete own comments |
| **Likes** | Like/unlike posts |
| **Follows** | Follow/unfollow users; view followers/following |
| **Stories** | Create stories; delete own stories; view friends' stories |
| **Bookmarks** | Bookmark/remove bookmarks |
| **Messaging** | Create conversations; send/receive messages; view own conversations |
| **Notifications** | View own notifications; mark as read |
| **Reporting** | Submit reports on content/users |

**Restrictions:**
- Cannot edit posts older than 24 hours
- Cannot message users who have blocked them
- Cannot follow themselves

---

## Moderator (Level 2)

Trusted users with content moderation privileges.

**Inherits all User permissions**, plus:

| Category | Permissions |
|----------|-------------|
| **Reports** | View all reports; resolve reports; take moderation actions |
| **Content** | Delete any post/comment; view deleted content |
| **Users** | View user profiles including private fields; issue warnings |
| **Stories** | View any story (including non-friends) |
| **Messages** | Read messages in reported conversations (audit only) |

**Restrictions:**
- Cannot ban or verify users
- Cannot access system configuration
- All moderation actions are logged

---

## Admin (Level 3)

Full system access.

**Inherits all Moderator permissions**, plus:

| Category | Permissions |
|----------|-------------|
| **Users** | Ban/unban users; verify user accounts; delete accounts; view all user data |
| **System** | Configure app settings; manage feature flags; view analytics |
| **Content** | Delete any content without restriction |
| **Admin** | Manage moderator roles; access audit logs; system configuration |
| **Reports** | Overturn moderator decisions |

**Restrictions:**
- Admin actions are audited and irreversible

---

## Appwrite Teams Implementation

### Team Structure

Three Appwrite teams map to the role hierarchy:

| Team ID | Role | Created | Membership |
|---------|------|---------|------------|
| `users` | User | Auto on signup | All verified users |
| `moderators` | Moderator | Manual invite | Moderators assigned by admin |
| `admins` | Admin | Manual invite | System administrators |

### Membership Management

```javascript
// Add user to a team (via Appwrite Function)
const membership = await teams.createMembership(
  'moderators',       // teamId
  [],                 // roles
  'user@email.com',   // email
  'https://app.com/invite'  // invite URL
);

// Check user's roles
const memberships = await account.listMemberships();
const isModerator = memberships.teams.some(t => t.$id === 'moderators');
```

### Role Assignment Flow

```
Admin invites user to 'moderators' team
  → User receives email invitation
  → User accepts invitation
  → Appwrite Function updates profile.role = 'moderator'
```

---

## Permission Enforcement

### Client-Side

```javascript
// Conditionally render UI based on role
const canDeletePost = (post) => {
  if (user.role === 'admin') return true;
  if (user.role === 'moderator') return true;
  return post.authorId === user.$id;
};
```

### Server-Side (Appwrite Functions)

```javascript
// Enforce role in Appwrite Function
export default async function ({ req, res, log, databases }) {
  const user = req.headers['x-appwrite-user'];
  const userRole = user.role; // From decoded JWT or DB lookup

  if (userRole === 'user' && req.path !== '/posts/' + user.$id) {
    return res.json({ success: false, error: { code: 'MOD_001', message: 'Insufficient permissions' } }, 403);
  }

  return res.json({ success: true, data: {} });
}
```

### Database-Level (Appwrite Permissions)

See `permissions.md` for detailed collection and document-level permissions.

---

## Audit Trail

All role-sensitive actions are logged:

| Action | Logged Fields |
|--------|---------------|
| Post deletion by moderator | `{ action: 'delete_post', moderatorId, postId, reason }` |
| User ban by admin | `{ action: 'ban_user', adminId, targetId, reason, duration }` |
| Role change | `{ action: 'role_change', adminId, targetId, oldRole, newRole }` |
| Report resolution | `{ action: 'resolve_report', moderatorId, reportId, action }` |
